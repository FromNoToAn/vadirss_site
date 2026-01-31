import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler

from config import TBANK_BASE_URL, TBANK_TERMINAL_KEY
from db.requests import (
    delete_old_users,
    delete_pending_payment,
    get_amount_for_level,
    get_pending_by_order_id,
    get_subscription_by_level,
    get_subscriptions,
    get_user_by_phone,
    save_pending_payment,
    save_user,
)
from tbank import generate_order_id, init_payment

app = Flask(__name__)
CORS(app)

# Initialize scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(func=delete_old_users, trigger="interval", days=1)
scheduler.start()

# Seed subscriptions if table empty
# try:
#     seed_subscriptions_if_empty()
# except Exception as e:
#     import logging
#     logging.getLogger(__name__).warning("seed_subscriptions_if_empty: %s", e)


def _tbank_url(path: str) -> str | None:
    if not TBANK_BASE_URL:
        return None
    return f"{TBANK_BASE_URL.rstrip('/')}{path}"


def _safe_int(val, default: int = 0) -> int:
    if val is None:
        return default
    try:
        return int(val)
    except (TypeError, ValueError):
        return default


def _safe_list(val):
    if val is None:
        return []
    if isinstance(val, list):
        return val
    if isinstance(val, (tuple, dict)):
        return list(val) if isinstance(val, tuple) else list(val.values())
    return []


@app.route("/api/tbank/init", methods=["POST"])
def tbank_init():
    """Инициировать платёж Т-Банк. Тело: subscription_type, subscription_level, phone_number | team_word. Возвращает PaymentURL."""
    data = request.get_json() or {}
    subscription_type = data.get("subscription_type", "individual")
    subscription_level = data.get("subscription_level")

    try:
        amount = get_amount_for_level(subscription_level)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    if subscription_type == "individual":
        phone_number = data.get("phone_number")
        if not phone_number:
            return jsonify({"error": "Phone number required"}), 400
        team_word = None
    else:
        team_word = (data.get("team_word") or "").strip()
        if not team_word:
            return jsonify({"error": "Team word required"}), 400
        phone_number = None

    try:
        order_id = generate_order_id()
        save_pending_payment(
            order_id=order_id,
            subscription_type=subscription_type,
            subscription_level=subscription_level,
            phone_number=phone_number,
            team_word=team_word,
        )
    except Exception as e:
        return jsonify({"error": "Failed to save pending payment"}), 500

    description = f"Подписка {subscription_level} ({subscription_type})"
    data_payload = {"Phone": phone_number} if phone_number else None
    notification_url = _tbank_url("/api/tbank/notification")
    success_url = _tbank_url("/payment/success")
    fail_url = _tbank_url("/payment/fail")

    try:
        res = init_payment(
            order_id=order_id,
            amount=amount,
            description=description,
            notification_url=notification_url,
            success_url=success_url,
            fail_url=fail_url,
            data=data_payload,
        )
    except Exception as e:
        app.logger.exception("T-Bank Init failed: %s", e)
        return jsonify({"error": "T-Bank Init failed", "detail": str(e)}), 502

    return jsonify({"PaymentURL": res["PaymentURL"]}), 200


@app.route("/api/subscriptions", methods=["GET"])
def api_subscriptions():
    """Список тарифов для фронта: цены в копейках, акцентный цвет, фичи."""
    subs = get_subscriptions()
    out = []
    for s in subs:
        try:
            level = s.level or ""
            out.append({
                "id": level.lower(),
                "level": level,
                "title": str(s.title) if s.title is not None else "",
                "description": str(s.description) if s.description is not None else "",
                "badge": s.badge,
                "price_kopecks": _safe_int(s.price_kopecks),
                "price_discount_kopecks": _safe_int(s.price_discount_kopecks),
                "accent_color": str(s.accent_color) if s.accent_color is not None else "#999",
                "sort_order": _safe_int(s.sort_order),
                "features": _safe_list(s.features),
                "accent_icons": _safe_list(s.accent_icons),
                "tooltips": _safe_list(s.tooltips),
            })
        except Exception as e:
            app.logger.warning("Skip subscription id=%s level=%s: %s", getattr(s, "id", None), getattr(s, "level", None), e)
    return jsonify(out), 200


@app.route("/api/tbank/config", methods=["GET"])
def tbank_config():
    """Публичная конфигурация для виджета Т-Банк (terminalKey, initUrl)."""
    return jsonify({
        "terminalKey": TBANK_TERMINAL_KEY or "",
        "initUrl": "/api/tbank/init",
    }), 200


@app.route("/api/tbank/notification", methods=["POST"])
def tbank_notification():
    """Webhook Т-Банка: при Status=CONFIRMED создаём пользователя из pending и удаляем pending."""
    raw = request.get_data(as_text=True)
    try:
        data = request.get_json(force=True) if raw else {}
    except Exception:
        data = {}

    order_id = data.get("OrderId")
    status = data.get("Status")

    if status != "CONFIRMED":
        return "", 200

    if not order_id:
        return "", 200

    pending = get_pending_by_order_id(order_id)
    if not pending:
        return "", 200

    try:
        save_user(
            phone_number=pending.phone_number,
            subscription_level=pending.subscription_level,
            subscription_type=pending.subscription_type,
            team_word=pending.team_word,
        )
        delete_pending_payment(order_id)
    except Exception as e:
        app.logger.exception("tbank notification: %s", e)
        return "", 500

    return "", 200


@app.route("/payment/success")
def payment_success():
    return (
        "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Оплата</title></head>"
        "<body><p>Оплата прошла успешно. Подписка активирована.</p>"
        "<a href='/'>Вернуться на главную</a></body></html>",
        200,
        {"Content-Type": "text/html; charset=utf-8"},
    )


@app.route("/payment/fail")
def payment_fail():
    return (
        "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Оплата</title></head>"
        "<body><p>Оплата не выполнена. Попробуйте снова.</p>"
        "<a href='/'>Вернуться на главную</a></body></html>",
        200,
        {"Content-Type": "text/html; charset=utf-8"},
    )


@app.route('/pay_subscription', methods=['POST'])
def pay_subscription():
    data = request.get_json() or {}
    subscription_type = data.get('subscription_type', 'individual')
    subscription_level = data.get('subscription_level')

    if not subscription_level or not get_subscription_by_level(subscription_level):
        return jsonify({'error': 'Invalid subscription level'}), 400

    payment_success = True 

    if payment_success:
        try:
            if subscription_type == 'individual':
                phone_number = data.get('phone_number')
                if not phone_number:
                    return jsonify({'error': 'Phone number required'}), 400
                user = save_user(phone_number, subscription_level, subscription_type)
                return jsonify({'message': 'Subscription activated', 'user_id': user.id}), 200
            else:  # team
                team_word = data.get('team_word')
                if not team_word:
                    return jsonify({'error': 'Team word required'}), 400
                user = save_user(None, subscription_level, subscription_type, team_word)
                return jsonify({'message': 'Team subscription activated', 'team_code': user.code_word}), 200
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            return jsonify({'error': 'Failed to save user'}), 500
    else:
        return jsonify({'error': 'Payment failed'}), 400

@app.route('/get_user/<phone_number>', methods=['GET'])
def get_user(phone_number):
    user = get_user_by_phone(phone_number)
    if user:
        return jsonify({'phone_number': user.phone_number, 'subscription_level': user.subscription_level}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/')
def index():
    return send_from_directory('site', 'subscribe_form.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('site', path)

if __name__ == '__main__':
    from config import create_ssh_tunnel
    if os.environ.get('SSH_HOST'):
        create_ssh_tunnel()
    try:
        app.run(debug=True)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()

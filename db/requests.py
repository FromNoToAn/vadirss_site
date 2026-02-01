from sqlalchemy.orm import Session
from .models import PendingPayment, SessionLocal, Subscription, User
from datetime import datetime, timedelta, timezone as tz
import random
import string

def format_phone(phone: str) -> str:
    """Нормализует номер к виду: 7 и 10 цифр (всего 11 цифр), без скобок и плюса."""
    digits = ''.join(filter(str.isdigit, phone))
    if len(digits) == 10:
        return '7' + digits
    if len(digits) == 11 and digits.startswith('7'):
        return digits
    if len(digits) == 11 and digits.startswith('8'):
        return '7' + digits[1:]
    raise ValueError("Неверный формат номера. Введите 10 цифр или 11 цифр (начиная с 7 или 8).")

def save_user(phone_number: str, subscription_level: str, subscription_type: str = 'individual', team_word: str = None):
    db: Session = SessionLocal()
    try:
        if subscription_type == 'individual':
            if not phone_number:
                raise ValueError("Phone number required for individual subscription")
            formatted_phone = format_phone(phone_number)
            # Check if user already exists
            existing_user = db.query(User).filter(User.phone_number == formatted_phone).first()
            if existing_user:
                raise ValueError("User with this phone number already exists")
            user = User(phone_number=formatted_phone, subscription_level=subscription_level, subscription_type=subscription_type)
        else:  # team
            if not team_word:
                raise ValueError("Team word required for team subscription")
            # Generate unique code_word: team_word + random 4-digit code
            while True:
                random_code = ''.join(random.choices(string.digits, k=4))
                code_word = team_word + random_code
                existing = db.query(User).filter(User.code_word == code_word).first()
                if not existing:
                    break
            user = User(subscription_level=subscription_level, subscription_type=subscription_type, code_word=code_word)

        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except Exception as e:
        print(f"Error saving user: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def get_user_by_phone(phone_number: str):
    db: Session = SessionLocal()
    try:
        formatted_phone = format_phone(phone_number)
        print(f"Querying for phone_number: {formatted_phone}")
        user = db.query(User).filter(User.phone_number == formatted_phone).first()
        print(f"Found user: {user}")
        return user
    finally:
        db.close()

def delete_old_users():
    db: Session = SessionLocal()
    try:
        cutoff_date = datetime.now(tz.utc) - timedelta(days=30)
        old_users = db.query(User).filter(User.created_at < cutoff_date).all()
        for user in old_users:
            db.delete(user)
        db.commit()
        print(f"Deleted {len(old_users)} old users.")
    except Exception as e:
        db.rollback()
        print(f"Error deleting old users: {e}")
    finally:
        db.close()


def save_pending_payment(
    order_id: str,
    subscription_type: str,
    subscription_level: str,
    phone_number: str | None = None,
    team_word: str | None = None,
) -> PendingPayment:
    db: Session = SessionLocal()
    try:
        row = PendingPayment(
            order_id=order_id,
            subscription_type=subscription_type,
            subscription_level=subscription_level,
            phone_number=phone_number,
            team_word=team_word,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return row
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


def get_pending_by_order_id(order_id: str) -> PendingPayment | None:
    db: Session = SessionLocal()
    try:
        return db.query(PendingPayment).filter(PendingPayment.order_id == order_id).first()
    finally:
        db.close()


def delete_pending_payment(order_id: str) -> None:
    db: Session = SessionLocal()
    try:
        row = db.query(PendingPayment).filter(PendingPayment.order_id == order_id).first()
        if row:
            db.delete(row)
            db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


def get_subscriptions():
    db: Session = SessionLocal()
    try:
        return (
            db.query(Subscription)
            .order_by(Subscription.sort_order.asc(), Subscription.id.asc())
            .all()
        )
    finally:
        db.close()


def get_subscription_by_level(level: str) -> Subscription | None:
    db: Session = SessionLocal()
    try:
        return db.query(Subscription).filter(Subscription.level == level.upper()).first()
    finally:
        db.close()


def get_amount_for_level(level: str) -> int:
    """Цена со скидкой в копейках для оплаты (Т-Банк)."""
    sub = get_subscription_by_level(level)
    if not sub:
        raise ValueError(f"Unknown subscription level: {level}")
    v = sub.price_discount_kopecks
    if v is None:
        raise ValueError(f"price_discount_kopecks is NULL for level {level}")
    try:
        return int(v)
    except (TypeError, ValueError) as e:
        raise ValueError(f"Invalid price_discount_kopecks for level {level}: {e}") from e
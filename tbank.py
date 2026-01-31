# -*- coding: utf-8 -*-
"""Интеграция с Т-Банк API (Init, подпись Token)."""

from __future__ import annotations

import hashlib
import uuid
from typing import Any

import requests

from config import (
    TBANK_BASE_URL,
    TBANK_INIT_URL,
    TBANK_PASSWORD,
    TBANK_TERMINAL_KEY,
)


def _build_token(params: dict[str, Any], password: str) -> str:
    """Формирование подписи Token для Т-Банк API.

    Параметры корневого уровня (без вложенных объектов) + Password,
    сортировка по ключу, конкатенация значений, SHA-256.
    """
    pairs: list[dict[str, str]] = [{"Password": password}]
    for k, v in params.items():
        if k == "Token":
            continue
        if isinstance(v, (dict, list)):
            continue
        pairs.append({k: str(v)})
    pairs.sort(key=lambda p: list(p.keys())[0])
    concat = "".join(list(p.values())[0] for p in pairs)
    return hashlib.sha256(concat.encode("utf-8")).hexdigest()


def init_payment(
    *,
    order_id: str,
    amount: int,
    description: str,
    notification_url: str | None = None,
    success_url: str | None = None,
    fail_url: str | None = None,
    data: dict[str, str] | None = None,
) -> dict[str, Any]:
    """Инициировать платёж (Init). Возвращает ответ API (Success, PaymentURL, ...)."""
    if not TBANK_TERMINAL_KEY or not TBANK_PASSWORD:
        raise RuntimeError("TBANK_TERMINAL_KEY и TBANK_PASSWORD должны быть заданы в .env")
    payload: dict[str, Any] = {
        "TerminalKey": TBANK_TERMINAL_KEY,
        "Amount": amount,
        "OrderId": order_id,
        "Description": description,
    }
    if notification_url:
        payload["NotificationURL"] = notification_url
    if success_url:
        payload["SuccessURL"] = success_url
    if fail_url:
        payload["FailURL"] = fail_url
    if data:
        payload["DATA"] = data

    payload["Token"] = _build_token(payload, TBANK_PASSWORD)

    resp = requests.post(
        TBANK_INIT_URL,
        json=payload,
        headers={"Content-Type": "application/json"},
        timeout=30,
    )
    resp.raise_for_status()
    out = resp.json()
    if not out.get("Success"):
        raise RuntimeError(
            out.get("Message") or out.get("Details") or f"Init failed: {out}"
        )
    return out


def generate_order_id() -> str:
    return str(uuid.uuid4())

from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timezone as tz
from config import DATABASE_URI

Base = declarative_base()
engine = create_engine(DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Subscription(Base):
    """Тарифы подписки: цены в копейках, акцентный цвет, фичи для фронта."""

    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(String(20), unique=True, nullable=False)  # BASE, EXTENDED, PREMIUM
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    badge = Column(String(32), nullable=True)
    price_kopecks = Column(Integer, nullable=False)  # без скидки
    price_discount_kopecks = Column(Integer, nullable=False)  # со скидкой, для оплаты
    accent_color = Column(String(32), nullable=False)
    sort_order = Column(Integer, default=0)
    features = Column(JSON, nullable=True)  # ["...", ...]
    accent_icons = Column(JSON, nullable=True)  # ["rgba(...)", ...]
    tooltips = Column(JSON, nullable=True)  # ["...", ...]


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(20), unique=True, index=True, nullable=True)
    subscription_level = Column(String(20))  # 'base', 'extended', 'premium'
    subscription_type = Column(String(20))  # 'individual' or 'team'
    code_word = Column(String(50), unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(tz.utc))


class PendingPayment(Base):
    """Ожидающие подтверждения платежи Т-Банка (до webhook CONFIRMED)."""

    __tablename__ = 'pending_payments'

    order_id = Column(String(36), primary_key=True)
    subscription_type = Column(String(20), nullable=False)
    subscription_level = Column(String(20), nullable=False)
    phone_number = Column(String(20), nullable=True)
    team_word = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(tz.utc))


Base.metadata.create_all(bind=engine)

# Backend для системы управления подписками

Flask-приложение для управления индивидуальными и командными подписками с подключением к MySQL через SSH-туннель.

## Описание

Этот бекенд предоставляет API для управления подписками пользователей. Система поддерживает два типа подписок:
- **Индивидуальная подписка** - привязывается к номеру телефона
- **Командная подписка** - использует кодовое слово команды

Доступны три уровня подписки:
- `BASE` - Базовая
- `EXTENDED` - Расширенная
- `PREMIUM` - Премиум

## Технологии

- **Flask** 3.1.2 - веб-фреймворк
- **SQLAlchemy** 2.0.45 - ORM для работы с базой данных
- **PyMySQL** 1.1.2 - драйвер для MySQL
- **SSH Tunnel** - подключение к удаленной БД через SSH
- **APScheduler** 3.10.4 - планировщик задач для автоматической очистки старых записей
- **Flask-CORS** 6.0.2 - поддержка CORS
- **Т-Банк эквайринг** - оплата подписок через iframe (Init, webhook)

## Структура проекта

```
db_connect/
├── backend.py          # Основной файл приложения Flask
├── config.py           # Конфигурация подключения к БД, SSH и Т-Банк
├── tbank.py            # Интеграция Т-Банк API (Init, Token)
├── requirements.txt    # Зависимости проекта
├── db/
│   ├── models.py      # Модели базы данных (SQLAlchemy)
│   └── requests.py    # Функции для работы с БД
├── frontend/           # React-лендинг (Vite + TS), см. frontend/README.md
├── frontend_assets/    # Исходные статические ассеты лендинга
└── site/
    ├── subscribe_form.html  # HTML форма подписки + виджет Т-Банк iframe
    └── style.css           # Стили для формы
```

## Установка

1. Клонируйте репозиторий или скачайте проект

2. Установите зависимости:
```bash
pip install -r requirements.txt
```

3. Создайте файл `.env` в корне проекта со следующими переменными:
```env
# SSH настройки
SSH_HOST=your_ssh_host
SSH_USER=your_ssh_username
SSH_PASSWORD=your_ssh_password
SSH_PORT=22

# MySQL настройки
MYSQL_HOST=your_mysql_host
MYSQL_PORT=3306
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=your_database_name

# Локальный порт для SSH туннеля
LOCAL_BIND_PORT=3307

# Т-Банк эквайринг (оплата через iframe)
TBANK_TERMINAL_KEY=your_terminal_key
TBANK_PASSWORD=your_terminal_password
TBANK_TEST=true
TBANK_BASE_URL=https://your-public-domain.com
```

- **TBANK_TERMINAL_KEY**, **TBANK_PASSWORD** — из [личного кабинета Т-Банк](https://business.tbank.ru/oplata/main).
- **TBANK_TEST** — `true` для тестового API (`rest-api-test.tinkoff.ru`), `false` для боевого.
- **TBANK_BASE_URL** — публичный URL сайта (без слэша в конце). Нужен для NotificationURL, SuccessURL, FailURL. При локальной разработке используйте ngrok или аналог.

Цены и тарифы хранятся в БД (таблица `subscriptions`). При первом запуске в неё подставляются дефолтные тарифы (BASE, EXTENDED, PREMIUM), если таблица пуста.

## Запуск

**Локально (Flask):**
```bash
python backend.py
```
Приложение будет доступно по адресу: `http://127.0.0.1:5000`

**Под Gunicorn (продакшен, несколько воркеров):**  
SSH-туннель к MySQL должен создаваться один раз в master-процессе, иначе воркеры конфликтуют за порт 3307. Запускайте с конфигом:
```bash
gunicorn -c gunicorn_conf.py
```
В `gunicorn_conf.py` туннель поднимается в `on_starting`, воркеры подключаются к уже открытому `127.0.0.1:3307`.

## API Endpoints

### Тарифы

#### GET `/api/subscriptions`
Список тарифов для фронта (секция тарифов, модалка оплаты). Цены в копейках, акцентный цвет, фичи.

**Пример ответа:**
```json
[
  {
    "id": "base",
    "level": "BASE",
    "title": "Базовый",
    "description": "Кто только начинает",
    "badge": null,
    "price_kopecks": 69900,
    "price_discount_kopecks": 49900,
    "accent_color": "#333333",
    "sort_order": 0,
    "features": ["Базовый доступ к боту", "..."],
    "accent_icons": ["rgba(196, 241, 157, 1)", "..."],
    "tooltips": ["Базовый доступ, есть ограничения"]
  }
]
```

### Т-Банк (оплата через iframe)

#### GET `/api/tbank/config`
Публичная конфигурация для виджета: `terminalKey`, `initUrl`.

#### POST `/api/tbank/init`
Инициирует платёж в Т-Банке и возвращает **PaymentURL** для открытия формы в iframe. Тело запроса — как у `pay_subscription` (см. ниже). Ответ: `{ "PaymentURL": "https://..." }`.

#### POST `/api/tbank/notification`
Webhook Т-Банка. При `Status=CONFIRMED` создаётся пользователь из отложенного платежа и запись в `pending_payments` удаляется. Вызывается банком, не фронтендом.

### Страницы после оплаты

- **GET `/payment/success`** — переход после успешной оплаты.
- **GET `/payment/fail`** — переход после неуспешной.

### POST `/pay_subscription` (устаревший, без реальной оплаты)
Раньше использовался для «мгновенной» активации без платёжки. Оставлен для совместимости; для реальных платежей используется Т-Банк iframe.

**Тело запроса для индивидуальной подписки:**
```json
{
  "subscription_type": "individual",
  "subscription_level": "BASE",
  "phone_number": "79001234567"
}
```

**Тело запроса для командной подписки:**
```json
{
  "subscription_type": "team",
  "subscription_level": "EXTENDED",
  "team_word": "myteam"
}
```

**Возможные значения `subscription_level`:**
- `BASE`
- `EXTENDED`
- `PREMIUM`

**Ответ при успехе (индивидуальная):**
```json
{
  "message": "Subscription activated",
  "user_id": 1
}
```

**Ответ при успехе (командная):**
```json
{
  "message": "Team subscription activated",
  "team_code": "myteam1234"
}
```

### GET `/get_user/<phone_number>`
Получение информации о пользователе по номеру телефона.

**Пример запроса:**
```
GET /get_user/79001234567
```

**Ответ при успехе:**
```json
{
  "phone_number": "+79001234567",
  "subscription_level": "BASE"
}
```

**Ответ при отсутствии пользователя:**
```json
{
  "error": "User not found"
}
```

## Модель данных

### Таблица `subscriptions`
Тарифы подписки: цены в копейках (без скидки и со скидкой), акцентный цвет, фичи для фронта.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | Integer | PK |
| `level` | String(20) | BASE / EXTENDED / PREMIUM (уникальный) |
| `title` | String(100) | Название тарифа |
| `description` | String(255) | Краткое описание |
| `badge` | String(32) | Бейдж (Топ, VIP и т.п.), nullable |
| `price_kopecks` | Integer | Цена без скидки, копейки |
| `price_discount_kopecks` | Integer | Цена со скидкой, копейки (для оплаты) |
| `accent_color` | String(32) | Цвет акцента для фронта (#hex или rgba) |
| `sort_order` | Integer | Порядок вывода |
| `features` | JSON | Массив строк (фичи тарифа) |
| `accent_icons` | JSON | Массив цветов для иконок фич |
| `tooltips` | JSON | Массив подсказок |

При первом запуске, если таблица пуста, в неё добавляются дефолтные тарифы (BASE, EXTENDED, PREMIUM).

### Таблица `pending_payments`
Отложенные платежи до прихода webhook с `Status=CONFIRMED`.

| Поле | Тип | Описание |
|------|-----|----------|
| `order_id` | String(36) | OrderId из Т-Банк (PK) |
| `subscription_type` | String(20) | individual / team |
| `subscription_level` | String(20) | BASE / EXTENDED / PREMIUM |
| `phone_number` | String(20) | nullable |
| `team_word` | String(100) | nullable |
| `created_at` | DateTime | UTC |

### Таблица `users`

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | Integer | Первичный ключ |
| `phone_number` | String(20) | Номер телефона (уникальный, nullable) |
| `subscription_level` | String(20) | Уровень подписки (BASE/EXTENDED/PREMIUM) |
| `subscription_type` | String(20) | Тип подписки (individual/team) |
| `code_word` | String(50) | Кодовое слово команды (уникальное, nullable) |
| `created_at` | DateTime | Дата создания записи (UTC) |

## Особенности

- **SSH-туннель**: Автоматическое создание SSH-туннеля для безопасного подключения к удаленной MySQL базе данных
- **Т-Банк iframe**: Оплата через виджет Т-Банка (integration.js). Инициализация платежа только с бэкенда (Init), форма открывается в iframe
- **Webhook**: Подписка активируется после уведомления Т-Банка с `Status=CONFIRMED`, не при нажатии «Оплатить»
- **Автоматическая очистка**: Планировщик задач удаляет пользователей старше 30 дней (запускается раз в день)
- **Валидация телефонов**: Автоматическое форматирование номеров телефонов в формат +7XXXXXXXXXX
- **Уникальные коды команд**: Для командных подписок генерируется уникальный код (слово команды + 4 случайные цифры)
- **CORS**: Поддержка кросс-доменных запросов

## Веб-интерфейс

- **Форма подписки** (Flask): `http://127.0.0.1:5000/` — форма с оплатой через Т-Банк iframe.
- **React-лендинг** (Vite): в `frontend/` — лендинг sport.vadirss.ru на React с сохранением стилей из `frontend_assets`. Запуск: `cd frontend && npm i && npm run dev` → http://localhost:5173. Подробнее в `frontend/README.md`.

## Обработка ошибок

API возвращает следующие HTTP коды:
- `200` - Успешный запрос
- `400` - Ошибка валидации данных
- `404` - Пользователь не найден
- `500` - Внутренняя ошибка сервера

## Примечания

- При запуске приложения автоматически создается SSH-туннель к базе данных
- Таблицы в базе данных создаются автоматически при первом запуске (если их еще нет)
- Номера телефонов должны быть в формате 10 цифр или 11 цифр, начинающихся с 7
- Для индивидуальных подписок номер телефона должен быть уникальным
- Для командных подписок генерируется уникальный код команды
- Для работы Т-Банк webhook нужен публичный URL (TBANK_BASE_URL). При локальной разработке используйте ngrok и укажите его в TBANK_BASE_URL

## Известные проблемы (форма оплаты Т-Банк в iframe)

- **CSP: "Connecting to ws://localhost:50007 violates connect-src"**  
  Расширения (Cursor, React DevTools и т.п.) подключаются к WebSocket на localhost. В `frontend/index.html` в CSP для `connect-src` добавлены `ws://localhost:*` и `ws://127.0.0.1:*`. Если ошибка сохраняется, политика может задаваться внутри iframe Т-Банка (её мы не меняем). **Обход:** тестировать оплату в режиме инкогнито или в профиле без расширений.

- **POST id.tbank.ru/preidentity/api/v1/user-info 422 (Unprocessable Content)**  
  Запрос идёт из виджета Т-Банка (проверка пользователя). Мы его не вызываем. 422 часто из‑за тестового терминала, cookies или контекста iframe. Стоит попробовать инкогнито, другой браузер или уточнить у Т-Банка (openapi@tbank.ru).

## Лицензия

[Укажите лицензию, если необходимо]

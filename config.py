import os

from dotenv import load_dotenv
from sshtunnel import SSHTunnelForwarder


load_dotenv()

SSH_HOST = os.getenv('SSH_HOST', '')
SSH_USER = os.getenv('SSH_USER', '')
SSH_PASSWORD = os.getenv('SSH_PASSWORD', '')
SSH_PORT = int(os.getenv('SSH_PORT', '22'))

MYSQL_HOST = os.getenv('MYSQL_HOST', '')
MYSQL_PORT = int(os.getenv('MYSQL_PORT', ''))
MYSQL_USER = os.getenv('MYSQL_USER', '')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
MYSQL_DATABASE = os.getenv('MYSQL_DATABASE', '')

LOCAL_BIND_PORT = int(os.getenv('LOCAL_BIND_PORT', '3307'))

# T-Bank (Т-Банк) эквайринг
TBANK_TERMINAL_KEY = os.getenv('TBANK_TERMINAL_KEY', '')
TBANK_PASSWORD = os.getenv('TBANK_PASSWORD', '')
TBANK_TEST = os.getenv('TBANK_TEST', 'true').lower() in ('1', 'true', 'yes')
TBANK_INIT_URL = (
    'https://rest-api-test.tinkoff.ru/v2/Init'
    if TBANK_TEST
    else 'https://securepay.tinkoff.ru/v2/Init'
)
TBANK_BASE_URL = os.getenv('TBANK_BASE_URL', '').rstrip('/')  # URL сайта для NotificationURL, SuccessURL, FailURL

tunnel = None

DATABASE_URI = f'mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@127.0.0.1:{LOCAL_BIND_PORT}/{MYSQL_DATABASE}'

def create_ssh_tunnel():
    """Создает SSH-туннель для подключения к MySQL"""
    global tunnel, DATABASE_URI
    if tunnel is None or not tunnel.is_active:
        if not SSH_PASSWORD:
            raise ValueError(
                "SSH_PASSWORD не установлен! "
                "Создайте файл .env и добавьте: SSH_PASSWORD"
            )
        
        print(f"Подключение к SSH: {SSH_USER}@{SSH_HOST}:{SSH_PORT}")
        try:
            tunnel = SSHTunnelForwarder(
                (SSH_HOST, SSH_PORT),
                ssh_username=SSH_USER,
                ssh_password=SSH_PASSWORD,
                remote_bind_address=(MYSQL_HOST, MYSQL_PORT),
                local_bind_address=('127.0.0.1', LOCAL_BIND_PORT),
                allow_agent=False,
                host_pkey_directories=[],
                set_keepalive=30
            )
            tunnel.start()
            actual_port = tunnel.local_bind_port
            DATABASE_URI = f'mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@127.0.0.1:{actual_port}/{MYSQL_DATABASE}'
            print(f"SSH tunnel established. Local port: {actual_port}")
        except Exception as e:
            error_msg = (
                f"Ошибка создания SSH-туннеля:\n"
                f"  Хост: {SSH_USER}@{SSH_HOST}:{SSH_PORT}\n"
                f"  Ошибка: {str(e)}\n"
            )
            print(error_msg)
            raise
    return tunnel

def close_ssh_tunnel():
    """Закрывает SSH-туннель (вызов при необходимости)."""
    global tunnel
    if tunnel and tunnel.is_active:
        tunnel.stop()
        print("SSH tunnel closed")


create_ssh_tunnel()
# atexit не используем: иначе при debug/reloader при перезапуске процесса
# видно "SSH tunnel closed". Туннель живёт до выхода процесса.


"""
Конфиг Gunicorn: SSH-туннель к MySQL создаётся один раз в master-процессе,
воркеры подключаются к уже открытому порту 127.0.0.1:3307.
Без этого каждый воркер пытался бы создать свой туннель → "address in use".
"""
import os

# Приложение
wsgi_app = "backend:app"
bind = os.getenv("GUNICORN_BIND", "127.0.0.1:5000")  # за Nginx — localhost:5000
workers = int(os.getenv("GUNICORN_WORKERS", "2"))
worker_class = "sync"
timeout = 120

# SSH-туннель только в master
def on_starting(server):
    """Вызывается в master до форка воркеров: поднимаем туннель один раз."""
    if os.getenv("SSH_HOST"):
        from config import create_ssh_tunnel
        create_ssh_tunnel()


def on_exit(server):
    """При остановке Gunicorn закрываем туннель."""
    try:
        from config import close_ssh_tunnel
        close_ssh_tunnel()
    except Exception:
        pass

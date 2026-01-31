# Лендинг sport.vadirss.ru (React)

Реализация лендинга на **React + TypeScript + Vite** с сохранением всех стилей из `frontend_assets`.

## Запуск

```bash
cd frontend
npm install
npm run dev
```

Приложение: **http://localhost:5173**

Для доступа к API бекенда настроен прокси: запросы на `/api` уходят на `http://127.0.0.1:5000`.

## Сборка

```bash
npm run build
npm run preview   # просмотр production-сборки
```

## Структура

- `src/components/` — секции лендинга (MainHero, StepsProblems, RunningLine, Tariffs, FAQ и др.)
- `src/assets/styles/` — CSS из `frontend_assets` (inline-base, styles-*, блоки)
- `public/assets/img/` — изображения

Стили и классы разметки сохранены, поведение (бургер-меню, карусель тарифов, бегущая строка) реализовано на React.

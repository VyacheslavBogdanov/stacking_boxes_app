# CLAUDE.md

Этот файл содержит инструкции для Claude Code (claude.ai/code) при работе с кодом в этом репозитории.

## Стек технологий

- **Фронтенд:** Vue 3 + TypeScript + Vite + SCSS
- **Бэкенд:** Express.js (Node 22)
- **API-прокси:** маршруты `/api` проксируются на `http://81.94.156.176:5011` (настроено в `vite.config.ts`)

## Команды

```bash
npm run dev          # Запуск dev-сервера Vite с HMR
npm run build        # Проверка типов + продакшн-сборка
npm run build-only   # Продакшн-сборка без проверки типов
npm run type-check   # Проверка типов через vue-tsc
npm run lint         # ESLint с автоисправлением
npm run format       # Форматирование src/ через Prettier
npm run preview      # Локальный просмотр продакшн-сборки
```

## Стиль кода

- **Форматирование:** Prettier — табы, ширина строки 100 символов, висячие запятые
- **Линтер:** ESLint 9 (flat config) с поддержкой Vue 3 + TypeScript + Prettier
- **Алиас путей:** `@/*` → `./src/*`

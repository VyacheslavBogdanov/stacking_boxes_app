# CLAUDE.md

Этот файл содержит инструкции для Claude Code (claude.ai/code) при работе с кодом в этом репозитории.

## Стек технологий

- **Фронтенд:** Vue 3 + TypeScript + Vite + SCSS
- **Состояние:** Pinia
- **Unit-тесты:** Vitest + @vue/test-utils
- **E2E-тесты:** Playwright
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
npm run test         # Unit-тесты Vitest (однократно)
npm run test:watch   # Vitest в watch-режиме
npm run test:e2e     # E2E-тесты Playwright
```

## Стиль кода

- **Принципы:** KISS, SOLID, DRY
- **Форматирование:** Prettier — табы, ширина строки 100 символов, висячие запятые
- **Линтер:** ESLint 9 (flat config) с поддержкой Vue 3 + TypeScript + Prettier
- **Алиас путей:** `@/*` → `./src/*`
- **Лимиты:** макс. 300 строк/компонент, 100 символов/строка

### Именование файлов

- Компоненты: `PascalCase.vue` (`BoxInputForm.vue`)
- TypeScript: `camelCase.ts` (`stackCalculation.ts`)
- SCSS: `_kebab-case.scss` (`_variables.scss`)

### Именование кода

- Переменные и функции: `camelCase`
- Интерфейсы и типы: `PascalCase`
- Константы: `UPPER_SNAKE_CASE`
- Props: `camelCase`, emit events: `kebab-case`
- CSS классы: БЭМ (`box-input__field--error`)

### Vue компоненты

- Все компоненты используют `<script setup lang="ts">`
- Порядок секций SFC: `<script setup>` → `<template>` → `<style lang="scss" scoped>`

### TypeScript

- Strict mode, без `any` (использовать `unknown` или конкретный тип)
- `interface` — для объектов и props, `type` — для union типов

### SCSS

- Методология БЭМ
- Макс. 3 уровня вложенности
- Все значения — через SCSS-переменные и миксины, не хардкодить

## Тестирование

- **Подход:** TDD — Red → Green → Refactor
- **Unit-тесты:** рядом с файлом (`*.test.ts`), E2E: в `e2e/` (`*.spec.ts`)
- **Описания тестов** (`describe`, `it`) — на **русском языке**
- Подробности: [`src/docs/testing.md`](src/docs/testing.md)

## Git

- **Ветки:** `тип/описание` от `master` (`feat/box-input-form`, `fix/stack-height-calculation`)
- **Коммиты:** `тип: описание` (`feat: добавить форму ввода параметров коробки`)
- **Перед коммитом:** `npm run test && npm run lint && npm run format && npm run build`

## Запрещено

- Магические числа и строки (использовать константы)
- `any` тип
- Inline стили (использовать SCSS классы)
- `!important` в CSS
- Компоненты > 300 строк
- Прямые обращения к DOM (использовать ref и Vue API)

## Документация

- [Архитектура](src/docs/architecture.md) — слои, структура папок, поток данных
- [Соглашения по коду](src/docs/coding-conventions.md) — подробные правила и примеры
- [Тестирование](src/docs/testing.md) — TDD, шаблоны тестов, примеры

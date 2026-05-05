# Stacking Boxes Calculator

Калькулятор штабелирования коробок — приложение для расчёта максимальной высоты штабеля, количества рядов и допустимого веса на коробку в зависимости от параметров коробки и марки картона.

## Функционал

- **Ввод параметров коробки** — длина, ширина, высота (мм), масса брутто (кг), марка картона
- **Расчёт результатов** — максимальная высота штабеля, количество рядов, максимальный вес на коробку
- **История расчётов** — сохранение последних расчётов, просмотр выбранного расчёта, очистка истории
- **Админ-панель** — добавление, редактирование и удаление марок картона
- **Авторизация администратора** — вход через логин/пароль, JWT-токен, хранение пароля в виде bcrypt-хеша

## Стек технологий

| Область      | Технология                                |
| ------------ | ----------------------------------------- |
| UI-фреймворк | Vue 3 (Composition API, `<script setup>`) |
| Язык         | TypeScript                                |
| Сборщик      | Vite                                      |
| Стили        | SCSS (BEM)                                |
| Состояние    | Pinia                                     |
| Бэкенд       | Express.js                                |
| Авторизация  | bcryptjs + JWT                            |
| Unit-тесты   | Vitest + @vue/test-utils                  |
| E2E-тесты    | Playwright                                |

## Требования

- Node.js 20+
- npm

Рекомендуемая версия Node.js: 20 или 22.

## Установка

```bash
npm install
```

## Настройка окружения

Для работы backend и админ-панели нужен файл `.env` в корне проекта.

Создайте его на основе `.env.example`:

```bash
cp .env.example .env
```

Пример `.env.example`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=
JWT_SECRET=
PORT=5011
```

### Генерация пароля администратора

Пароль администратора не хранится в открытом виде.
В `.env` нужно указать bcrypt-хеш пароля.

Например, чтобы использовать пароль `admin`, выполните:

```bash
node --input-type=module -e "import bcrypt from 'bcryptjs'; console.log(await bcrypt.hash('admin', 10));"
```

Команда выведет строку вида:

```text
$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Скопируйте её в `.env`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
JWT_SECRET=
PORT=5011
```

### Генерация JWT_SECRET

`JWT_SECRET` используется сервером для подписи токенов авторизации.

Сгенерируйте секрет:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Скопируйте результат в `.env`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=5011
```

JWT-токен вручную создавать не нужно.
Сервер создаёт его автоматически после успешного входа в админ-панель.

## Запуск в режиме разработки

Для полноценной работы приложения нужно запустить и frontend, и backend:

```bash
npm run dev:full
```

После запуска:

- frontend: `http://localhost:5173`
- backend: `http://localhost:5011`

## Вход в админ-панель

На главной странице нажмите иконку администратора.

Используйте:

```text
Логин: значение ADMIN_USERNAME из .env
Пароль: пароль, из которого был создан ADMIN_PASSWORD_HASH
```

Например, если bcrypt-хеш был создан из пароля `admin`, то вход:

```text
Логин: admin
Пароль: admin
```

## Команды

| Команда                     | Описание                                    |
| --------------------------- | ------------------------------------------- |
| `npm run dev`               | Запуск только frontend Vite                 |
| `npm run server`            | Запуск только backend Express через nodemon |
| `npm run dev:full`          | Запуск frontend и backend одновременно      |
| `npm run build`             | Проверка типов + production-сборка frontend |
| `npm run build-only`        | Production-сборка без проверки типов        |
| `npm run preview`           | Локальный просмотр production-сборки        |
| `npm run type-check`        | Проверка типов frontend через vue-tsc       |
| `npm run type-check:server` | Проверка типов backend через tsc            |
| `npm run lint`              | ESLint с автоисправлением                   |
| `npm run format`            | Форматирование `src/` через Prettier        |
| `npm run test`              | Unit-тесты Vitest                           |
| `npm run test:watch`        | Vitest в watch-режиме                       |
| `npm run test:e2e`          | E2E-тесты Playwright                        |

## Проверка проекта

Перед передачей или деплоем рекомендуется выполнить:

```bash
npm run type-check
npm run type-check:server
npm run test
npm run test:e2e
```

Ожидаемый результат:

- type-check проходит без ошибок
- server type-check проходит без ошибок
- unit-тесты проходят
- E2E-тесты проходят

## Структура проекта

```text
stacking_boxes_app/
├── e2e/                         — E2E-тесты Playwright (*.e2e.ts)
├── server/                      — Express backend
│   ├── data/                    — JSON-хранилище данных
│   │   ├── grades.json          — список марок картона
│   │   └── gradeProperties.json — свойства марок картона
│   ├── helpers/                 — вспомогательные функции
│   ├── middleware/              — middleware, включая JWT-проверку
│   ├── routes/                  — backend-маршруты
│   ├── app.ts                   — Express-приложение
│   ├── config.ts                — переменные окружения
│   ├── index.ts                 — запуск сервера
│   └── types.ts                 — backend-типы
├── src/
│   ├── api/                     — HTTP-клиент и сервисы для API
│   ├── components/              — Vue-компоненты
│   │   └── ui/                  — базовые переиспользуемые компоненты
│   ├── composables/             — переиспользуемая логика
│   ├── docs/                    — документация проекта
│   ├── stores/                  — Pinia-сторы
│   ├── styles/                  — SCSS: переменные, миксины, глобальные стили
│   ├── types/                   — TypeScript-типы и интерфейсы
│   ├── utils/                   — расчётные утилиты
│   ├── App.vue                  — корневой компонент
│   └── main.ts                  — точка входа frontend
├── .env.example                 — шаблон переменных окружения
├── vite.config.ts               — конфигурация Vite
├── vitest.config.ts             — конфигурация Vitest
├── playwright.config.ts         — конфигурация Playwright
├── tsconfig.server.json         — TypeScript-конфиг backend
└── package.json                 — зависимости и npm-скрипты
```

## Архитектура

Приложение разделено на слои с чёткой ответственностью:

```text
Types → API → Stores → Composables → Components → Template
```

- **Types** — интерфейсы и типы данных
- **API** — HTTP-клиент, сервисные функции для frontend-запросов
- **Stores** — Pinia-сторы, реактивное состояние приложения
- **Composables** — бизнес-логика, валидация, обработка ошибок
- **Components** — UI-компоненты и feature-компоненты
- **Server** — Express backend, авторизация, CRUD марок картона, расчёт

Подробнее — в [документации по архитектуре](src/docs/architecture.md).

## API backend

Backend запускается на порту `5011`.

Основные маршруты:

| Метод  | Маршрут         | Описание                             | Доступ |
| ------ | --------------- | ------------------------------------ | ------ |
| GET    | `/grades`       | Получить список марок картона        | public |
| GET    | `/grades/admin` | Получить марки картона со свойствами | admin  |
| POST   | `/grades`       | Добавить марку картона               | admin  |
| PUT    | `/grades/:id`   | Обновить марку картона               | admin  |
| DELETE | `/grades/:id`   | Удалить марку картона                | admin  |
| POST   | `/calculate`    | Выполнить расчёт штабелирования      | public |
| POST   | `/login`        | Авторизация администратора           | public |
| POST   | `/logout`       | Выход администратора                 | public |

Защищённые маршруты требуют заголовок:

```text
Authorization: Bearer <token>
```

Frontend получает и отправляет этот токен автоматически.

## Документация

| Документ                                                   | Описание                                          |
| ---------------------------------------------------------- | ------------------------------------------------- |
| [Архитектура](src/docs/architecture.md)                    | Слои, структура папок, поток данных, конфигурация |
| [Соглашения по коду](src/docs/coding-conventions.md)       | Именование, форматирование, правила и примеры     |
| [Тестирование](src/docs/testing.md)                        | Подход к тестам, шаблоны тестов, примеры          |
| [План реализации](src/docs/implementation-plan.md)         | Этапы и порядок реализации                        |
| [Техническое задание](src/docs/technical_specification.md) | Требования к функционалу приложения               |

## Безопасность

Файл `.env` содержит реальные секреты и не должен попадать в git.

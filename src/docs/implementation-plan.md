# План имплементации — Stacking Boxes Calculator

Пошаговый план реализации приложения «Калькулятор штабелирования коробок».
Задачи упорядочены по зависимостям: от базовых слоёв к UI.

---

## - [x] Задача 1. Типы и интерфейсы

**Цель:** определить TypeScript-типы для всего приложения.

**Файлы:**

- [x] `src/types/cardboardGrade.ts` — интерфейс марки картона (`CardboardGrade`)
- [x] `src/types/boxParams.ts` — параметры коробки (`BoxParams`: length, width, height, grossWeight, gradeId)
- [x] `src/types/calculationResult.ts` — результат расчёта (`CalculationResult`: maxStackHeight, rowCount, maxWeightPerBox)
- [x] `src/types/gradeProperties.ts` — свойства марки картона (`GradeProperties`)
- [x] `src/types/cardboardGradePayload.ts` — payload для создания/редактирования марки
- [x] `src/types/cardboardGradeWithProperties.ts` — полная марка картона для админки
- [x] `src/types/calculationHistoryItem.ts` — элемент истории расчётов
- [x] `src/types/index.ts` — реэкспорт всех типов

**Критерий готовности:** `npm run type-check` проходит без ошибок.

---

## - [x] Задача 2. API-сервис

**Цель:** слой взаимодействия с бэкендом через `/api` прокси.

**Файлы:**

- [x] `src/api/httpClient.ts` — базовый HTTP-клиент (fetch-обёртка с обработкой ошибок и JWT)
- [x] `src/api/cardboardGradeApi.ts` — CRUD марок картона (`getAll`, `getAllForAdmin`, `create`, `update`, `remove`)
- [x] `src/api/calculationApi.ts` — запрос расчёта штабелирования
- [x] `src/api/authApi.ts` — авторизация администратора
- [x] `src/api/cardboardGradeApi.test.ts` — unit-тесты API марок картона
- [x] `src/api/calculationApi.test.ts` — unit-тесты API расчёта
- [x] `src/api/authApi.test.ts` — unit-тесты API авторизации

**Критерий готовности:** unit-тесты проходят (`npm run test`), типы корректны.

---

## - [x] Задача 3. Стор (Pinia)

**Цель:** управление состоянием приложения.

**Файлы:**

- [x] `src/stores/cardboardGradeStore.ts` — стор марок картона (загрузка, CRUD, adminGrades)
- [x] `src/stores/adminStore.ts` — стор авторизации админа (isAuthenticated, token, login, logout, clearAuth)
- [x] `src/stores/calculationHistoryStore.ts` — стор истории расчётов
- [x] `src/stores/cardboardGradeStore.test.ts` — unit-тесты стора марок
- [x] `src/stores/adminStore.test.ts` — unit-тесты стора авторизации
- [x] `src/stores/calculationHistoryStore.test.ts` — unit-тесты истории расчётов

**Зависимости:** Задача 1 (типы), Задача 2 (API-сервис).

**Критерий готовности:** unit-тесты проходят, сторы корректно вызывают API-методы и управляют состоянием.

---

## - [x] Задача 4. Composables

**Цель:** переиспользуемая логика для компонентов.

**Файлы:**

- [x] `src/composables/useStackCalculation.ts` — отправка параметров на расчёт, хранение результата
- [x] `src/composables/useCardboardGrades.ts` — доступ к маркам картона из стора
- [x] `src/composables/useAdmin.ts` — логика авторизации админа
- [x] `src/composables/useCalculationHistory.ts` — логика истории расчётов
- [x] `src/composables/useStackCalculation.test.ts` — unit-тесты
- [x] `src/composables/useCardboardGrades.test.ts` — unit-тесты
- [x] `src/composables/useAdmin.test.ts` — unit-тесты
- [x] `src/composables/useCalculationHistory.test.ts` — unit-тесты

**Зависимости:** Задача 3 (стор).

**Критерий готовности:** unit-тесты проходят, composables корректно работают с реактивными данными.

---

## - [x] Задача 5. Базовые UI-компоненты

**Цель:** переиспользуемые UI-элементы с BEM/SCSS.

**Файлы:**

- [x] `src/components/ui/BaseInput.vue` — текстовое поле (label, placeholder, ошибка валидации)
- [x] `src/components/ui/BaseButton.vue` — кнопка (варианты: primary, secondary, danger)
- [x] `src/components/ui/BaseDropdown.vue` — кастомный выпадающий список (options, modelValue, placeholder, закрытие по клику вне компонента)
- [x] `src/components/ui/BaseInput.test.ts` — unit-тесты
- [x] `src/components/ui/BaseButton.test.ts` — unit-тесты
- [x] `src/components/ui/BaseDropdown.test.ts` — unit-тесты
- [x] `src/styles/_variables.scss` — SCSS-переменные (цвета, размеры, отступы)
- [x] `src/styles/_mixins.scss` — SCSS-миксины

**Критерий готовности:** компоненты рендерятся, принимают props, эмитят события, тесты проходят.

---

## - [x] Задача 6. Форма ввода параметров

**Цель:** компонент BoxInputForm с 5 полями ввода.

**Файлы:**

- [x] `src/components/BoxInputForm.vue` — форма: длина, ширина, высота (мм), масса брутто (кг), марка картона (dropdown)
- [x] `src/components/BoxInputForm.test.ts` — unit-тесты

**UX-доработки:**

- [x] Подписаны единицы измерения рядом с полями:
    - Длина, мм
    - Ширина, мм
    - Высота, мм
    - Масса брутто, кг
- [x] Dropdown марок картона заменён на кастомный аккуратный список

**Зависимости:** Задача 4 (composables), Задача 5 (UI-компоненты).

**Критерий готовности:** форма отображает 5 полей, валидирует ввод, эмитит данные для расчёта, тесты проходят.

---

## - [x] Задача 7. Блок результатов

**Цель:** компонент ResultsDisplay для отображения 3 результатов расчёта.

**Файлы:**

- [x] `src/components/ResultsDisplay.vue` — макс. высота штабеля (мм), кол-во рядов (шт), макс. масса на коробку (кг)
- [x] `src/components/ResultsDisplay.test.ts` — unit-тесты

**UX-доработки:**

- [x] Добавлена кнопка закрытия результата (`×`)
- [x] Закрытие результата не очищает историю расчётов

**Зависимости:** Задача 1 (типы).

**Критерий готовности:** компонент отображает результаты, корректно обрабатывает пустое/загруженное состояние, результат можно закрыть, тесты проходят.

---

## - [x] Задача 8. Главная страница

**Цель:** сборка формы, результатов и истории в `App.vue`.

**Файлы:**

- [x] `src/App.vue` — подключение BoxInputForm + ResultsDisplay + CalculationHistory + AdminLogin/AdminPanel
- [x] `src/styles/main.scss` — глобальные стили приложения

**UX-доработки:**

- [x] Рабочая зона калькулятора отцентрована
- [x] История отображается слева и не сдвигает калькулятор
- [x] Заголовок калькулятора отцентрирован
- [x] На мобильной ширине блоки перестраиваются в одну колонку

**Зависимости:** Задача 6 (форма), Задача 7 (результаты).

**Критерий готовности:** приложение работает end-to-end: ввод → запрос к API → отображение результатов → запись в историю.

---

## - [x] Задача 9. Админ-панель

**Цель:** авторизация админа и CRUD-управление марками картона.

**Файлы:**

- [x] `src/components/AdminLogin.vue` — форма входа админа
- [x] `src/components/AdminPanel.vue` — таблица марок картона с кнопками добавить/редактировать/удалить
- [x] `src/components/AdminLogin.test.ts` — unit-тесты
- [x] `src/components/AdminPanel.test.ts` — unit-тесты

**UX-доработки:**

- [x] В поле пароля добавлен простой SVG-глаз для показа/скрытия пароля
- [x] Глаз расположен внутри поля пароля
- [x] Админ-панель показывает success/error сообщения
- [x] Удаление требует подтверждения

**Зависимости:** Задача 4 (composables), Задача 5 (UI-компоненты).

**Критерий готовности:** админ может войти, добавить/изменить/удалить марку картона, изменения видны всем пользователям, тесты проходят.

---

## - [ ] Задача 10. E2E-тесты

**Цель:** полные пользовательские сценарии через Playwright.

**Файлы:**

- [ ] `e2e/calculator.spec.ts` — сценарий: заполнение формы → получение результата
- [ ] `e2e/admin.spec.ts` — сценарий: вход админа → CRUD марок картона
- [ ] `e2e/history.spec.ts` — сценарий: несколько расчётов → история последних 10 расчётов → просмотр записи → закрытие результата

**Зависимости:** Задачи 8, 9, 13, 14.

**Критерий готовности:** `npm run test:e2e` проходит, сценарии калькулятора, админки и истории расчётов зелёные.

---

## - [x] Задача 11. Расчётная утилита (фронтенд)

**Цель:** реализовать логику расчёта штабелирования на фронтенде. Формулы в файле `Калькулятор.xlsx`.

**Файлы:**

- [x] `src/types/gradeProperties.ts` — интерфейс `GradeProperties { thickness: number; crushResistance: number }`
- [x] `src/types/index.ts` — реэкспорт `GradeProperties`
- [x] `src/utils/constants.ts` — константы расчёта
- [x] `src/utils/stackCalculation.ts` — чистая функция `calculateStacking(params: BoxParams, grade: GradeProperties): CalculationResult`
- [x] `src/utils/stackCalculation.test.ts` — unit-тесты

**Зависимости:** Задача 1 (типы).

**Критерий готовности:** unit-тесты проходят (`npm run test`), функция возвращает корректные результаты по формулам из `Калькулятор.xlsx`.

---

## - [x] Задача 12. Бэкенд Express

**Цель:** Express-сервер в папке `server/` с CRUD марок картона, эндпоинтом расчёта и авторизацией админа. Свойства марок (thickness, crushResistance) хранятся отдельным маппингом (не в CardboardGrade). Формулы в файле `Калькулятор.xlsx`.

### Авторизация и безопасность

**Хеширование пароля:**

- [x] Пароль админа хранится в `.env` как bcrypt-хеш (`ADMIN_PASSWORD_HASH`)
- [x] Библиотека: `bcryptjs` (чистый JS, без нативных зависимостей)
- [x] При POST `/login` сервер сравнивает пароль с хешем через `bcryptjs.compare()`

**JWT-токены:**

- [x] При успешном логине сервер создаёт JWT с payload `{ sub: username }`, TTL 8 часов
- [x] Секрет подписи — `JWT_SECRET` из `.env`
- [x] Фронтенд отправляет токен в заголовке `Authorization: Bearer <token>`

**Хранение секретов:**

- [x] Файл `.env` (НЕ коммитится, добавлен в `.gitignore`):
    ```
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD_HASH=$2a$10$...
    JWT_SECRET=<случайная строка 32+ символов>
    PORT=5011
    ```
- [x] Файл `.env.example` (коммитится) — шаблон без значений

**Защищённые маршруты:**

- [x] POST/PUT/DELETE `/grades` — требуют JWT (authMiddleware)
- [x] GET `/grades`, POST `/calculate`, POST `/login` — публичные
- [x] GET `/grades/admin` — требует JWT и возвращает полные свойства марок

### Зависимости для установки

**Runtime:** `bcryptjs`, `jsonwebtoken`, `dotenv`
**Dev:** `tsx`, `@types/express`, `@types/cors`, `@types/jsonwebtoken`, `@types/bcryptjs`

> `express`, `cors`, `uuid`, `nodemon` — уже установлены

### Файлы

- [x] `server/app.ts` — создание Express-приложения (cors, json, маршруты), экспорт для тестов
- [x] `server/index.ts` — импорт app, запуск `.listen(PORT)`
- [x] `server/config.ts` — загрузка `.env` через dotenv, экспорт типизированных констант
- [x] `server/types.ts` — серверные интерфейсы (GradeProperties, AuthPayload и др.)
- [x] `server/middleware/authMiddleware.ts` — проверка JWT из заголовка Authorization
- [x] `server/routes/grades.ts` — GET/POST/PUT/DELETE `/grades`, GET `/grades/admin`
- [x] `server/routes/calculate.ts` — POST `/calculate`
- [x] `server/routes/auth.ts` — POST `/login`, `/logout`
- [x] `server/helpers/jsonStore.ts` — чтение/запись JSON-файлов данных
- [x] `server/data/grades.json` — начальные данные марок `[{id, name}]`
- [x] `server/data/gradeProperties.json` — маппинг `gradeId → {thickness, crushResistance}`
- [x] `tsconfig.server.json` — TypeScript-конфиг для серверного кода
- [x] `.env` — секреты (не коммитится)
- [x] `.env.example` — шаблон `.env`
- [x] npm-скрипт `"server": "nodemon"` + `nodemon.json` с `exec: "tsx server/index.ts"`

### Тесты

Тесты серверного кода — рядом с исходниками (`*.test.ts`), с `// @vitest-environment node`:

- [x] `server/routes/auth.test.ts`
- [x] `server/routes/grades.test.ts`
- [x] `server/routes/calculate.test.ts`
- [x] `server/middleware/authMiddleware.test.ts`
- [x] `server/helpers/jsonStore.test.ts`

**Зависимости:** Задача 11 (расчётная утилита).

**Критерий готовности:** сервер запускается на порту 5011, CRUD марок работает, эндпоинт расчёта возвращает корректные результаты, авторизация админа через bcrypt + JWT функционирует, секреты не попадают в git.

---

## - [x] Задача 13. История расчётов и управление результатами

**Цель:** улучшить UX калькулятора: дать пользователю возможность закрывать блок результата и просматривать историю последних 10 расчётов.

### Функциональность

- [x] После успешного расчёта блок `ResultsDisplay` отображается как сейчас, но у него появляется кнопка закрытия (`×`)
- [x] При нажатии на `×` блок результата скрывается
- [x] Каждый успешный расчёт сохраняется в историю
- [x] История хранит последние 10 расчётов
- [x] История сохраняется в `localStorage` и не пропадает после обновления страницы
- [x] Визуально блок истории показывает компактный список примерно на 5 записей, остальные доступны через прокрутку
- [x] В истории отображаются:
    - дата и время расчёта
    - введённые параметры коробки: длина, ширина, высота, масса брутто
    - выбранная марка картона
    - результат расчёта: maxStackHeight, rowCount, maxWeightPerBox
- [x] История отображается слева от основного калькулятора
- [x] При клике на запись истории можно посмотреть, какие значения были введены и какой результат был получен
- [x] Новая запись добавляется в начало истории
- [x] Если записей больше 10, самая старая удаляется

### Файлы

- [x] `src/types/calculationHistoryItem.ts` — тип элемента истории расчётов
- [x] `src/stores/calculationHistoryStore.ts` — Pinia-store истории последних 10 расчётов
- [x] `src/stores/calculationHistoryStore.test.ts` — unit-тесты store
- [x] `src/composables/useCalculationHistory.ts` — composable для работы с историей
- [x] `src/composables/useCalculationHistory.test.ts` — unit-тесты composable
- [x] `src/components/CalculationHistory.vue` — таблица истории расчётов
- [x] `src/components/CalculationHistory.test.ts` — unit-тесты таблицы истории
- [x] `src/components/ResultsDisplay.vue` — добавить кнопку закрытия результата
- [x] `src/components/ResultsDisplay.test.ts` — тест закрытия результата
- [x] `src/App.vue` — подключить историю слева и управление отображением результата

### UX-требования

- [x] История не должна мешать основному калькулятору
- [x] На широком экране история отображается слева
- [x] На мобильном экране история отображается ниже формы
- [x] Кнопка закрытия результата понятная и доступная через `aria-label`
- [x] Закрытие результата не удаляет запись из истории
- [x] История сохраняется в `localStorage`

### Тесты

- [x] история добавляет новый расчёт в начало списка
- [x] история хранит максимум 10 записей
- [x] история сохраняет входные параметры и результат
- [x] история восстанавливается из `localStorage`
- [x] клик по записи истории показывает данные расчёта
- [x] кнопка `×` скрывает текущий результат
- [x] закрытие результата не очищает историю

**Зависимости:** Задача 8, Задача 11, Задача 12.

**Критерий готовности:** после расчёта результат можно закрыть, последние 10 расчётов отображаются в истории, данные истории корректны, история сохраняется после обновления страницы, unit-тесты проходят.

---

## - [x] Задача 14. Улучшение UX и логики админ-панели

**Цель:** улучшить админ-панель после базовой реализации: показывать полные свойства марок картона, упростить редактирование, сохранить сессию администратора и добавить безопасные UX-состояния.

### Функциональность

- [x] При редактировании марки поля `thickness` и `crushResistance` подставляются автоматически
- [x] Админ-панель показывает текущие свойства марки:
    - название
    - толщина картона
    - сопротивление сжатию
- [x] Для админки добавлен отдельный endpoint, который возвращает полные данные марок
- [x] JWT сохраняется после перезагрузки страницы
- [x] Перед удалением марки есть подтверждение
- [x] После добавления, редактирования и удаления отображаются success/error сообщения
- [x] При ошибке API админ видит человекочитаемое сообщение
- [x] Кнопки действий блокируются во время выполнения запроса
- [x] В форме входа админа добавлено переключение видимости пароля
- [x] При невалидном/истёкшем токене авторизация очищается

### Backend

- [x] Добавлен тип полной марки картона `CardboardGradeWithProperties`
- [x] Добавлен защищённый endpoint `GET /grades/admin`
- [x] `GET /grades/admin` возвращает массив:
    ```ts
    {
    	id: string;
    	name: string;
    	thickness: number;
    	crushResistance: number;
    }
    [];
    ```
- [x] Публичный `GET /grades` оставлен без изменений:
    ```ts
    {
    	id: string;
    	name: string;
    }
    [];
    ```
- [x] Добавлены тесты для `GET /grades/admin`
- [x] Проверено, что `GET /grades/admin` без JWT возвращает `401`

### Frontend API

- [x] Добавлен тип `CardboardGradeWithProperties`
- [x] Добавлен метод `getAllForAdmin()` в `src/api/cardboardGradeApi.ts`
- [x] Обновлены тесты `src/api/cardboardGradeApi.test.ts`
- [x] Для публичной формы калькулятора оставлено использование обычного `getAll()`

### Store / Composables

- [x] В `cardboardGradeStore` добавлен отдельный список `adminGrades`
- [x] Добавлен метод `fetchAdminGrades()`
- [x] Добавлены состояния/логика:
    - success-сообщения в UI
    - `actionError`
    - `isSaving`
    - `deletingGradeId`
- [x] Обновлён `useCardboardGrades`
- [x] Обновлены unit-тесты store/composable

### AdminPanel

- [x] Использует `fetchAdminGrades()` вместо обычного `fetchGrades()`
- [x] Отображает таблицу с колонками:
    - Марка
    - Толщина
    - Сопротивление сжатию
    - Действия
- [x] При нажатии `Редактировать` автоматически заполняет:
    - `name`
    - `thickness`
    - `crushResistance`
- [x] Перед удалением показывает подтверждение
- [x] После успешного добавления показывает сообщение: `Марка добавлена`
- [x] После успешного редактирования показывает сообщение: `Марка обновлена`
- [x] После успешного удаления показывает сообщение: `Марка удалена`
- [x] После ошибки показывает сообщение ошибки
- [x] Кнопки блокируются во время запроса
- [x] Обновлён `src/components/AdminPanel.test.ts`

### Авторизация

- [x] JWT сохраняется в `localStorage`
- [x] При загрузке приложения JWT восстанавливается из `localStorage`
- [x] При logout JWT удаляется из `localStorage`
- [x] После перезагрузки страницы админ остаётся авторизованным
- [x] При невалидном/истёкшем токене авторизация очищается
- [x] Обновлены тесты `adminStore` и `useAdmin`

### Тесты

- [x] `GET /grades/admin` возвращает полные данные с JWT
- [x] `GET /grades/admin` возвращает `401` без JWT
- [x] `AdminPanel` показывает `thickness` и `crushResistance`
- [x] `Редактировать` заполняет все поля
- [x] `Удалить` требует подтверждение
- [x] success-сообщение появляется после add/update/delete
- [x] JWT сохраняется и восстанавливается из `localStorage`

**Зависимости:** Задача 9, Задача 12.

**Критерий готовности:** админ-панель показывает полные свойства марок, редактирование не требует повторного ручного ввода технических параметров, удаление подтверждается, сообщения об операциях отображаются, JWT-сессия сохраняется после перезагрузки страницы, unit-тесты проходят.

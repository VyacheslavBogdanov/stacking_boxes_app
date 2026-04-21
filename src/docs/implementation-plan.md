# План имплементации — Stacking Boxes Calculator

Пошаговый план реализации приложения «Калькулятор штабелирования коробок».
Задачи упорядочены по зависимостям: от базовых слоёв к UI.

---

## - [x] Задача 1. Типы и интерфейсы

**Цель:** определить TypeScript-типы для всего приложения.

**Файлы:**

-   [x] `src/types/cardboardGrade.ts` — интерфейс марки картона (`CardboardGrade`)
-   [x] `src/types/boxParams.ts` — параметры коробки (`BoxParams`: length, width, height, grossWeight, gradeId)
-   [x] `src/types/calculationResult.ts` — результат расчёта (`CalculationResult`: maxStackHeight, rowCount, maxWeightPerBox)
-   [x] `src/types/index.ts` — реэкспорт всех типов

**Критерий готовности:** `npm run type-check` проходит без ошибок.

---

## - [x] Задача 2. API-сервис

**Цель:** слой взаимодействия с бэкендом через `/api` прокси.

**Файлы:**

-   [x] `src/api/httpClient.ts` — базовый HTTP-клиент (fetch-обёртка с обработкой ошибок)
-   [x] `src/api/cardboardGradeApi.ts` — CRUD марок картона (getAll, create, update, delete)
-   [x] `src/api/calculationApi.ts` — запрос расчёта штабелирования
-   [x] `src/api/cardboardGradeApi.test.ts` — unit-тесты API марок картона
-   [x] `src/api/calculationApi.test.ts` — unit-тесты API расчёта

**Критерий готовности:** unit-тесты проходят (`npm run test`), типы корректны.

---

## - [ ] Задача 3. Стор (Pinia)

**Цель:** управление состоянием приложения.

**Файлы:**

-   [ ] `src/stores/cardboardGradeStore.ts` — стор марок картона (загрузка, CRUD)
-   [ ] `src/stores/adminStore.ts` — стор авторизации админа (isAuthenticated, login, logout)
-   [ ] `src/stores/cardboardGradeStore.test.ts` — unit-тесты стора марок
-   [ ] `src/stores/adminStore.test.ts` — unit-тесты стора авторизации

**Зависимости:** Задача 1 (типы), Задача 2 (API-сервис).

**Критерий готовности:** unit-тесты проходят, стор корректно вызывает API-методы.

---

## - [ ] Задача 4. Composables

**Цель:** переиспользуемая логика для компонентов.

**Файлы:**

-   [ ] `src/composables/useStackCalculation.ts` — отправка параметров на расчёт, хранение результата
-   [ ] `src/composables/useCardboardGrades.ts` — доступ к маркам картона из стора
-   [ ] `src/composables/useAdmin.ts` — логика авторизации админа
-   [ ] `src/composables/useStackCalculation.test.ts` — unit-тесты
-   [ ] `src/composables/useCardboardGrades.test.ts` — unit-тесты
-   [ ] `src/composables/useAdmin.test.ts` — unit-тесты

**Зависимости:** Задача 3 (стор).

**Критерий готовности:** unit-тесты проходят, composables корректно работают с реактивными данными.

---

## - [ ] Задача 5. Базовые UI-компоненты

**Цель:** переиспользуемые UI-элементы с BEM/SCSS.

**Файлы:**

-   [ ] `src/components/ui/BaseInput.vue` — текстовое поле (label, placeholder, ошибка валидации)
-   [ ] `src/components/ui/BaseButton.vue` — кнопка (варианты: primary, secondary, danger)
-   [ ] `src/components/ui/BaseDropdown.vue` — выпадающий список (options, modelValue, placeholder)
-   [ ] `src/components/ui/BaseInput.test.ts` — unit-тесты
-   [ ] `src/components/ui/BaseButton.test.ts` — unit-тесты
-   [ ] `src/components/ui/BaseDropdown.test.ts` — unit-тесты
-   [ ] `src/styles/_variables.scss` — SCSS-переменные (цвета, размеры, отступы)
-   [ ] `src/styles/_mixins.scss` — SCSS-миксины

**Критерий готовности:** компоненты рендерятся, принимают props, эмитят события, тесты проходят.

---

## - [ ] Задача 6. Форма ввода параметров

**Цель:** компонент BoxInputForm с 5 полями ввода.

**Файлы:**

-   [ ] `src/components/BoxInputForm.vue` — форма: длина, ширина, высота (мм), масса брутто (кг), марка картона (дропдаун)
-   [ ] `src/components/BoxInputForm.test.ts` — unit-тесты

**Зависимости:** Задача 4 (composables), Задача 5 (UI-компоненты).

**Критерий готовности:** форма отображает 5 полей, валидирует ввод, эмитит данные для расчёта, тесты проходят.

---

## - [ ] Задача 7. Блок результатов

**Цель:** компонент ResultsDisplay для отображения 3 результатов расчёта.

**Файлы:**

-   [ ] `src/components/ResultsDisplay.vue` — макс. высота штабеля (мм), кол-во рядов (шт), макс. масса на коробку (кг)
-   [ ] `src/components/ResultsDisplay.test.ts` — unit-тесты

**Зависимости:** Задача 1 (типы).

**Критерий готовности:** компонент отображает результаты, корректно обрабатывает пустое/загруженное состояние, тесты проходят.

---

## - [ ] Задача 8. Главная страница

**Цель:** сборка формы и результатов в `App.vue`.

**Файлы:**

-   [ ] `src/App.vue` — подключение BoxInputForm + ResultsDisplay, вызов расчёта
-   [ ] `src/styles/main.scss` — глобальные стили приложения

**Зависимости:** Задача 6 (форма), Задача 7 (результаты).

**Критерий готовности:** приложение работает end-to-end: ввод → запрос к API → отображение результатов.

---

## - [ ] Задача 9. Админ-панель

**Цель:** авторизация админа и CRUD-управление марками картона.

**Файлы:**

-   [ ] `src/components/AdminLogin.vue` — форма входа админа
-   [ ] `src/components/AdminPanel.vue` — таблица марок картона с кнопками добавить/редактировать/удалить
-   [ ] `src/components/AdminLogin.test.ts` — unit-тесты
-   [ ] `src/components/AdminPanel.test.ts` — unit-тесты

**Зависимости:** Задача 4 (composables), Задача 5 (UI-компоненты).

**Критерий готовности:** админ может войти, добавить/изменить/удалить марку картона, изменения видны всем пользователям, тесты проходят.

---

## - [ ] Задача 10. E2E-тесты

**Цель:** полные пользовательские сценарии через Playwright.

**Файлы:**

-   [ ] `e2e/calculator.spec.ts` — сценарий: заполнение формы → получение результата
-   [ ] `e2e/admin.spec.ts` — сценарий: вход админа → CRUD марок картона

**Зависимости:** Задачи 8, 9 (всё приложение собрано).

**Критерий готовности:** `npm run test:e2e` проходит, все сценарии зелёные.

---

## - [ ] Задача 11. Расчётная утилита (фронтенд)

**Цель:** реализовать логику расчёта штабелирования на фронтенде. Формулы в файле `Калькулятор.xlsx`.

**Файлы:**

-   [ ] `src/types/gradeProperties.ts` — интерфейс `GradeProperties { thickness: number; crushResistance: number }`
-   [ ] `src/types/index.ts` — реэкспорт `GradeProperties`
-   [ ] `src/utils/constants.ts` — константы расчёта
-   [ ] `src/utils/stackCalculation.ts` — чистая функция `calculateStacking(params: BoxParams, grade: GradeProperties): CalculationResult`
-   [ ] `src/utils/stackCalculation.test.ts` — unit-тесты

**Зависимости:** Задача 1 (типы).

**Критерий готовности:** unit-тесты проходят (`npm run test`), функция возвращает корректные результаты по формулам из `Калькулятор.xlsx`.

---

## - [ ] Задача 12. Бэкенд Express

**Цель:** Express-сервер в папке `server/` с CRUD марок картона, эндпоинтом расчёта и авторизацией админа. Свойства марок (thickness, crushResistance) хранятся отдельным маппингом (не в CardboardGrade). Формулы в файле `Калькулятор.xlsx`.

**Файлы:**

-   [ ] `server/index.ts` — Express-приложение (cors, json-парсинг, порт 5011)
-   [ ] `server/data/grades.json` — начальные данные марок `[{id, name}]`
-   [ ] `server/data/gradeProperties.json` — маппинг `gradeId → {thickness, crushResistance}`
-   [ ] `server/routes/grades.ts` — GET/POST/PUT/DELETE `/grades`
-   [ ] `server/routes/calculate.ts` — POST `/calculate`
-   [ ] `server/routes/auth.ts` — POST `/login`, `/logout`
-   [ ] npm-скрипт `"server": "nodemon server/index.ts"` в `package.json`

**Зависимости:** Задача 11 (расчётная утилита).

**Критерий готовности:** сервер запускается на порту 5011, CRUD марок работает, эндпоинт расчёта возвращает корректные результаты, авторизация админа функционирует.

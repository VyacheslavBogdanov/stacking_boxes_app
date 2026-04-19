# Соглашения по коду

## Общие принципы

Проект написан на TypeScript. Код разрабатывается с помощью Claude Code. Все соглашения направлены на то, чтобы AI-агент мог легко читать, понимать и модифицировать код.

### KISS — Keep It Simple, Stupid

Простые решения предпочтительнее сложных. Не создавать абстракции, утилиты и обёртки «на будущее». Три похожие строки кода лучше преждевременной абстракции. Минимум сложности для текущей задачи.

### SOLID

- **S — Single Responsibility:** один компонент / composable / store — одна задача. Если компонент растёт — декомпозировать
- **O — Open/Closed:** расширять поведение через props, slots и composables, не модифицируя существующие компоненты
- **L — Liskov Substitution:** компоненты с одинаковым интерфейсом (props/emits) должны быть взаимозаменяемы
- **I — Interface Segregation:** интерфейсы TypeScript должны быть специализированными, не раздутыми. Не заставлять компонент зависеть от полей, которые он не использует
- **D — Dependency Inversion:** компоненты зависят от абстракций (интерфейсы, composables), а не от конкретных реализаций (прямые вызовы fetch, localStorage)

### DRY — Don't Repeat Yourself

Не дублировать логику. Если один и тот же код встречается в нескольких местах — вынести в общую функцию, composable или компонент. Но не путать с KISS: повторение допустимо, если альтернатива — переусложнённая абстракция.

## Структура файлов

- Один компонент = один файл (SFC)
- Максимум 300 строк на компонент
- Максимум 100 символов в строке
- Если компонент растёт — декомпозировать на подкомпоненты
- Понятные имена файлов: `StackCalculator.vue`, не `Calculator.vue`

## Именование

### Файлы и директории

- Компоненты: `PascalCase.vue` (`BoxInputForm.vue`)
- TypeScript файлы: `camelCase.ts` (`stackCalculation.ts`)
- SCSS файлы: `_kebab-case.scss` (`_variables.scss`)
- Директории: `kebab-case` (`components/`, `stores/`)

### Код

- Переменные и функции: `camelCase`
- Интерфейсы и типы: `PascalCase`
- Константы: `UPPER_SNAKE_CASE`
- Props: `camelCase`
- Emit events: `kebab-case` (`update-dimensions`)
- CSS классы: БЭМ (`box-input__field--error`)

### Примеры

```typescript
// Хорошо
const boxLength = ref(0);
interface BoxInput {}
const MAX_STACK_HEIGHT = 2400;

// Плохо
const bl = ref(0);
interface params {}
const max = 2400;
```

## Vue компоненты

### Composition API

Все компоненты используют `<script setup lang="ts">`:

```vue
<script setup lang="ts">
import { computed } from 'vue';
import type { BoxInput } from '@/types/domain';

interface Props {
	box: BoxInput;
}

const props = defineProps<Props>();

const volume = computed(() =>
	props.box.length * props.box.width * props.box.height,
);
</script>

<template>
	<div class="box-card">
		<h3 class="box-card__title">{{ props.box.length }} × {{ props.box.width }} × {{ props.box.height }}</h3>
		<span class="box-card__volume">{{ volume }} мм³</span>
	</div>
</template>

<style lang="scss" scoped>
.box-card {
	&__title {
		font-size: 1.125rem;
		color: $color-primary;
	}
}
</style>
```

### Порядок секций в SFC

1. `<script setup lang="ts">` — логика
2. `<template>` — разметка
3. `<style lang="scss" scoped>` — стили

### Порядок внутри `<script setup>`

1. Импорты (Vue, затем сторонние, затем проектные)
2. Интерфейсы (Props, Emits)
3. defineProps / defineEmits
4. Composables (useStore, useRouter)
5. Реактивные данные (ref, reactive)
6. Computed properties
7. Watch
8. Функции-обработчики
9. Lifecycle hooks (onMounted, onUnmounted)

## TypeScript

### Строгий режим

TypeScript настроен в strict mode. Все типы должны быть указаны:

```typescript
// Хорошо
function formatDimension(mm: number): string {
	return `${mm} мм`;
}

// Плохо
function formatDimension(mm) {
	return `${mm} мм`;
}
```

### Типы vs Интерфейсы

- `interface` — для объектов и props
- `type` — для union типов и утилитных типов

```typescript
// Interface для объектов
interface BoxInput {
	length: number;
	width: number;
	height: number;
	grossWeight: number;
	cardboardGrade: string;
}

// Type для unions
type CardboardGrade = 'Т11' | 'Т23' | 'Т24';
type ViewMode = 'input' | 'result';
```

## SCSS и БЭМ

### Методология БЭМ

Все CSS классы следуют методологии БЭМ:

```scss
// Блок
.box-input {
}

// Элемент
.box-input__field {
}
.box-input__label {
}

// Модификатор блока
.box-input__field--error {
}

// Модификатор элемента
.box-input__btn--calculate {
}
```

### Вложенность SCSS

Максимум 3 уровня вложенности:

```scss
// Хорошо
.box-input {
	&__field {
		&--error {
			border-color: $color-error;
		}
	}
}

// Плохо — слишком глубоко
.page {
	.section {
		.box-input {
			.box-input__field {
				span {
				}
			}
		}
	}
}
```

### Переменные

Все значения — через SCSS-переменные и миксины:

```scss
// Хорошо
color: $color-primary;
padding: $spacing-md;
@include font-size(lg);

// Плохо
color: #2563eb;
padding: 16px;
font-size: 18px;
```

## Линтинг

### ESLint

ESLint настроен с Vue essential rules и TypeScript config. Конфиг: `eslint.config.js`.

```bash
npm run lint    # ESLint --fix
```

### Prettier

Prettier настроен (`.prettierrc.json`): табы, одинарные кавычки, точки с запятой, ширина 100 символов.

```bash
npm run format  # Prettier --write src/
```

### Перед коммитом

```bash
npm run test && npm run lint && npm run format && npm run build
```

## Тестирование

Общий подход — **TDD** (Test-Driven Development): сначала тест, потом код. Подробное руководство — в [`testing.md`](testing.md).

## Коммиты

- Формат: `тип: описание`
	- `feat: добавить форму ввода параметров коробки`
	- `fix: исправить расчёт высоты штабеля`
	- `style: обновить стили карточки результатов`
	- `refactor: декомпозировать StackCalculator`
	- `test: добавить тесты для расчёта штабелирования`

## Запрещено

- Магические числа и строки (использовать константы/переменные)
- Компоненты больше 300 строк
- Строки длиннее 100 символов
- Функции без типов
- `any` тип (использовать `unknown` или конкретный тип)
- Inline стили (использовать SCSS классы)
- `!important` в CSS
- Прямые обращения к DOM (использовать ref и Vue API)

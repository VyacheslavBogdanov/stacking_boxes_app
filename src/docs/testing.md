# Тестирование и TDD

## Команды

| Команда            | Описание                                  |
| ------------------ | ----------------------------------------- |
| `npm run test`     | Запуск unit-тестов (Vitest, однократно)   |
| `npm run test:watch` | Запуск Vitest в watch-режиме            |
| `npm run test:e2e` | Запуск E2E-тестов (Playwright)            |

## Подход к разработке — TDD

Новые фичи разрабатываются по циклу **Red → Green → Refactor**:

1. **Red** — написать тест, описывающий ожидаемое поведение. Убедиться, что тест падает.
2. **Green** — написать минимальный код, чтобы тест прошёл.
3. **Refactor** — улучшить код, не ломая тесты.

### Когда применять TDD

- Новые composables и утилиты
- Компоненты с логикой (расчёт штабеля, валидация размеров, выбор марки картона)
- Исправление багов (сначала тест, воспроизводящий баг)

### Когда допустимо не применять

- Чисто визуальные правки (стили, layout)
- Правки конфигов (vite.config, eslint.config и т.д.)

## Расположение и именование тестов

| Тип   | Расположение                    | Суффикс     |
| ----- | ------------------------------- | ----------- |
| Unit  | Рядом с тестируемым файлом      | `.test.ts`  |
| E2E   | `e2e/`                          | `.spec.ts`  |

- Unit-тесты лежат **рядом** с исходным файлом, а не в `__tests__/`
- Описания тестов (`describe`, `it`, `test`) — на **русском языке**

## Unit-тесты (Vitest + @vue/test-utils)

### Утилиты

Прямые assertions без дополнительной обвязки.

```ts
// src/utils/stackCalculation.test.ts
import { describe, it, expect } from 'vitest';
import { calculateMaxRows, calculateMaxStackHeight } from './stackCalculation';

describe('calculateMaxRows', () => {
	it('рассчитывает количество рядов по высоте и весу', () => {
		expect(calculateMaxRows({ height: 300, grossWeight: 10, maxStackHeight: 2400 })).toBe(8);
	});

	it('возвращает 1 для слишком тяжёлой коробки', () => {
		expect(calculateMaxRows({ height: 300, grossWeight: 500, maxStackHeight: 2400 })).toBe(1);
	});
});
```

### Composables

Создать `ref` → вызвать composable → проверить computed/reactive. Хелпер-фабрика для тестовых данных упрощает создание объектов.

```ts
// src/composables/useStackCalculation.test.ts
import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { useStackCalculation } from './useStackCalculation';
import type { BoxInput } from '../types/domain';

function makeBoxInput(overrides: Partial<BoxInput> = {}): BoxInput {
	return {
		length: 400,
		width: 300,
		height: 200,
		grossWeight: 10,
		cardboardGrade: 'Т23',
		...overrides,
	};
}

describe('useStackCalculation', () => {
	it('рассчитывает высоту штабеля для марки Т23', () => {
		const box = ref(makeBoxInput({ cardboardGrade: 'Т23' }));
		const { maxStackHeight, maxRows } = useStackCalculation(box);

		expect(maxStackHeight.value).toBeGreaterThan(0);
		expect(maxRows.value).toBeGreaterThanOrEqual(1);
	});
});
```

### Компоненты

`mount()` с props/slots → проверить DOM, классы, эмиты.

```ts
// src/components/BoxInputForm.test.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BoxInputForm from './BoxInputForm.vue';

describe('BoxInputForm', () => {
	it('рендерит поля ввода размеров', () => {
		const wrapper = mount(BoxInputForm);
		expect(wrapper.find('[data-test="length"]').exists()).toBe(true);
		expect(wrapper.find('[data-test="width"]').exists()).toBe(true);
		expect(wrapper.find('[data-test="height"]').exists()).toBe(true);
	});

	it('рендерит выпадающий список марок картона', () => {
		const wrapper = mount(BoxInputForm);
		expect(wrapper.find('select').exists()).toBe(true);
	});

	it('эмитит calculate с данными коробки', async () => {
		const wrapper = mount(BoxInputForm);
		await wrapper.find('[data-test="calculate-btn"]').trigger('click');
		expect(wrapper.emitted('calculate')).toBeTruthy();
	});
});
```

## E2E-тесты (Playwright)

### Правила

- Локаторы: CSS-классы, `placeholder`, `data-test`, `h1`, `a[href="..."]`
- Таймауты ожидания: 5–10 секунд (`{ timeout: 10_000 }`)
- Описания тестов на русском языке

### Шаблон

```ts
// e2e/stack-calculator.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Калькулятор штабелирования', () => {
	test('рассчитывает штабель для введённых параметров коробки', async ({ page }) => {
		await page.goto('/');

		await page.fill('[data-test="length"]', '400');
		await page.fill('[data-test="width"]', '300');
		await page.fill('[data-test="height"]', '200');
		await page.fill('[data-test="gross-weight"]', '10');
		await page.selectOption('[data-test="cardboard-grade"]', 'Т23');

		await page.click('[data-test="calculate-btn"]');

		await expect(page.locator('[data-test="max-stack-height"]')).toBeVisible();
		await expect(page.locator('[data-test="max-rows"]')).toBeVisible();
	});
});
```

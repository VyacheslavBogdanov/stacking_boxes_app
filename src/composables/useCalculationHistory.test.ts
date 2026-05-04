import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useCalculationHistory } from './useCalculationHistory';
import type { BoxParams, CalculationResult } from '@/types';

const params: BoxParams = {
	length: 447,
	width: 305,
	height: 110,
	grossWeight: 2,
	gradeId: '2',
};

const result: CalculationResult = {
	maxStackHeight: 2016,
	rowCount: 18,
	maxWeightPerBox: 34,
};

describe('useCalculationHistory', () => {
	beforeEach(() => {
		setActivePinia(createPinia());

		vi.stubGlobal('crypto', {
			randomUUID: vi.fn(() => 'history-id'),
		});

		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-05-04T12:00:00.000Z'));
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('добавляет расчёт в историю', () => {
		const { items, selectedItem, addItem } = useCalculationHistory();

		addItem({
			params,
			gradeName: 'Т23',
			result,
		});

		expect(items.value).toHaveLength(1);
		expect(items.value[0]).toEqual({
			id: 'history-id',
			createdAt: '2026-05-04T12:00:00.000Z',
			params,
			gradeName: 'Т23',
			result,
		});
		expect(selectedItem.value).toEqual(items.value[0]);
	});

	it('выбирает расчёт из истории', () => {
		const { items, selectedItem, addItem, selectItem } =
			useCalculationHistory();

		addItem({
			params,
			gradeName: 'Т23',
			result,
		});

		selectItem(items.value[0].id);

		expect(selectedItem.value).toEqual(items.value[0]);
	});

	it('очищает выбранный расчёт', () => {
		const { selectedItem, addItem, clearSelectedItem } =
			useCalculationHistory();

		addItem({
			params,
			gradeName: 'Т23',
			result,
		});

		expect(selectedItem.value).not.toBeNull();

		clearSelectedItem();

		expect(selectedItem.value).toBeNull();
	});

	it('очищает историю', () => {
		const { items, selectedItem, addItem, clearHistory } =
			useCalculationHistory();

		addItem({
			params,
			gradeName: 'Т23',
			result,
		});

		clearHistory();

		expect(items.value).toEqual([]);
		expect(selectedItem.value).toBeNull();
	});
});

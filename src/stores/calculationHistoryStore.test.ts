import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useCalculationHistoryStore } from './calculationHistoryStore';
import type {
	BoxParams,
	CalculationHistoryItem,
	CalculationResult,
} from '@/types';

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

const storedItem: CalculationHistoryItem = {
	id: '00000000-0000-4000-8000-000000000100',
	createdAt: '2026-05-04T10:00:00.000Z',
	params,
	gradeName: 'Т23',
	result,
};

describe('calculationHistoryStore', () => {
	beforeEach(() => {
		localStorage.clear();
		setActivePinia(createPinia());

		vi.stubGlobal('crypto', {
			randomUUID: vi.fn(() => '00000000-0000-4000-8000-000000000000'),
		});

		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-05-04T12:00:00.000Z'));
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
		localStorage.clear();
	});

	it('добавляет новый расчёт в начало истории', () => {
		const store = useCalculationHistoryStore();

		store.addItem({
			params,
			gradeName: 'Т23',
			result,
		});

		expect(store.items).toEqual([
			{
				id: '00000000-0000-4000-8000-000000000000',
				createdAt: '2026-05-04T12:00:00.000Z',
				params,
				gradeName: 'Т23',
				result,
			},
		]);

		expect(store.selectedItem).toEqual(store.items[0]);
	});

	it('сохраняет историю в localStorage', () => {
		const store = useCalculationHistoryStore();

		store.addItem({
			params,
			gradeName: 'Т23',
			result,
		});

		const stored = JSON.parse(
			localStorage.getItem('stacking-boxes-calculation-history') ?? '[]',
		) as CalculationHistoryItem[];

		expect(stored).toHaveLength(1);
		expect(stored[0].gradeName).toBe('Т23');
	});

	it('восстанавливает историю из localStorage', () => {
		localStorage.setItem(
			'stacking-boxes-calculation-history',
			JSON.stringify([storedItem]),
		);

		setActivePinia(createPinia());

		const store = useCalculationHistoryStore();

		expect(store.items).toEqual([storedItem]);
		expect(store.selectedItem).toBeNull();
	});

	it('хранит максимум 10 записей', () => {
		const store = useCalculationHistoryStore();

		for (let index = 0; index < 12; index += 1) {
			store.addItem({
				params: {
					...params,
					length: 400 + index,
				},
				gradeName: `Т${index}`,
				result,
			});
		}

		expect(store.items).toHaveLength(10);
		expect(store.items[0].params.length).toBe(411);
		expect(store.items[9].params.length).toBe(402);
	});

	it('выбирает запись истории по id', () => {
		const store = useCalculationHistoryStore();

		vi.mocked(crypto.randomUUID).mockReturnValueOnce(
			'00000000-0000-4000-8000-000000000001',
		);

		store.addItem({
			params,
			gradeName: 'Т23',
			result,
		});

		vi.mocked(crypto.randomUUID).mockReturnValueOnce(
			'00000000-0000-4000-8000-000000000002',
		);

		store.addItem({
			params: {
				...params,
				gradeId: '3',
			},
			gradeName: 'Т24',
			result,
		});

		store.selectItem('00000000-0000-4000-8000-000000000001');

		expect(store.selectedItem?.id).toBe(
			'00000000-0000-4000-8000-000000000001',
		);
		expect(store.selectedItem?.gradeName).toBe('Т23');
	});

	it('очищает выбранную запись', () => {
		const store = useCalculationHistoryStore();

		store.addItem({
			params,
			gradeName: 'Т23',
			result,
		});

		expect(store.selectedItem).not.toBeNull();

		store.clearSelectedItem();

		expect(store.selectedItem).toBeNull();
	});

	it('очищает всю историю и localStorage', () => {
		const store = useCalculationHistoryStore();

		store.addItem({
			params,
			gradeName: 'Т23',
			result,
		});

		store.clearHistory();

		expect(store.items).toEqual([]);
		expect(store.selectedItem).toBeNull();
		expect(
			localStorage.getItem('stacking-boxes-calculation-history'),
		).toBeNull();
	});
});

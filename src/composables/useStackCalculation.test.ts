import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStackCalculation } from './useStackCalculation';
import type { BoxParams, CalculationResult } from '@/types';

vi.mock('@/api/calculationApi');

const calculationApi = vi.mocked(await import('@/api/calculationApi'));

const MOCK_PARAMS: BoxParams = {
	length: 400,
	width: 300,
	height: 200,
	grossWeight: 10,
	gradeId: '1',
};

const MOCK_RESULT: CalculationResult = {
	maxStackHeight: 5,
	rowCount: 3,
	maxWeightPerBox: 12.5,
};

describe('useStackCalculation', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('начальное состояние', () => {
		it('должно иметь result = null', () => {
			const { result } = useStackCalculation();
			expect(result.value).toBeNull();
		});

		it('должно иметь isLoading = false', () => {
			const { isLoading } = useStackCalculation();
			expect(isLoading.value).toBe(false);
		});

		it('должно иметь error = null', () => {
			const { error } = useStackCalculation();
			expect(error.value).toBeNull();
		});
	});

	describe('calculate', () => {
		it('должен вызвать API и сохранить результат', async () => {
			calculationApi.calculate.mockResolvedValue(MOCK_RESULT);
			const { result, calculate } = useStackCalculation();

			await calculate(MOCK_PARAMS);

			expect(calculationApi.calculate).toHaveBeenCalledWith(MOCK_PARAMS);
			expect(result.value).toEqual(MOCK_RESULT);
		});

		it('должен устанавливать isLoading во время запроса', async () => {
			let resolvePromise!: (value: CalculationResult) => void;
			calculationApi.calculate.mockReturnValue(
				new Promise((resolve) => {
					resolvePromise = resolve;
				}),
			);
			const { isLoading, calculate } = useStackCalculation();

			const promise = calculate(MOCK_PARAMS);
			expect(isLoading.value).toBe(true);

			resolvePromise(MOCK_RESULT);
			await promise;
			expect(isLoading.value).toBe(false);
		});

		it('должен записать ошибку при неудаче', async () => {
			calculationApi.calculate.mockRejectedValue(new Error('Ошибка сервера'));
			const { error, calculate } = useStackCalculation();

			await calculate(MOCK_PARAMS);

			expect(error.value).toBe('Ошибка сервера');
		});

		it('должен сбросить error при успешном запросе после ошибки', async () => {
			calculationApi.calculate.mockRejectedValueOnce(new Error('Ошибка'));
			const { error, calculate } = useStackCalculation();

			await calculate(MOCK_PARAMS);
			expect(error.value).toBe('Ошибка');

			calculationApi.calculate.mockResolvedValue(MOCK_RESULT);
			await calculate(MOCK_PARAMS);
			expect(error.value).toBeNull();
		});
	});

	describe('reset', () => {
		it('должен сбросить все рефы в начальное состояние', async () => {
			calculationApi.calculate.mockResolvedValue(MOCK_RESULT);
			const { result, error, calculate, reset } = useStackCalculation();

			await calculate(MOCK_PARAMS);
			expect(result.value).toEqual(MOCK_RESULT);

			reset();

			expect(result.value).toBeNull();
			expect(error.value).toBeNull();
		});
	});
});

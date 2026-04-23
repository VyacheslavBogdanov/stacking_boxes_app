// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { BoxParams, CalculationResult } from '@/types';
import { ApiError } from './httpClient';
import { calculate } from './calculationApi';

function mockFetchResponse(data: unknown, status = 200): void {
	vi.spyOn(globalThis, 'fetch').mockResolvedValue({
		ok: true,
		status,
		headers: new Headers({ 'content-length': '1' }),
		json: () => Promise.resolve(data),
	} as Response);
}

function mockFetchError(status: number, body: unknown = null): void {
	vi.spyOn(globalThis, 'fetch').mockResolvedValue({
		ok: false,
		status,
		headers: new Headers(),
		json: () => Promise.resolve(body),
	} as Response);
}

const boxParams: BoxParams = {
	length: 400,
	width: 300,
	height: 200,
	grossWeight: 15,
	gradeId: '1',
};

const calcResult: CalculationResult = {
	maxStackHeight: 5,
	rowCount: 3,
	maxWeightPerBox: 75,
};

describe('calculationApi', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	describe('calculate', () => {
		it('должен отправить POST на /api/calculate с BoxParams и вернуть результат', async () => {
			mockFetchResponse(calcResult);

			const result = await calculate(boxParams);

			expect(result).toEqual(calcResult);
			expect(globalThis.fetch).toHaveBeenCalledWith('/api/calculate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(boxParams),
			});
		});

		it('должен бросить ApiError при ошибке 400', async () => {
			mockFetchError(400, { message: 'Bad Request' });

			await expect(calculate(boxParams)).rejects.toThrow(ApiError);
			await expect(calculate(boxParams)).rejects.toMatchObject({ status: 400 });
		});

		it('должен бросить ApiError при ошибке 500', async () => {
			mockFetchError(500, { message: 'Internal Server Error' });

			await expect(calculate(boxParams)).rejects.toThrow(ApiError);
			await expect(calculate(boxParams)).rejects.toMatchObject({ status: 500 });
		});
	});
});

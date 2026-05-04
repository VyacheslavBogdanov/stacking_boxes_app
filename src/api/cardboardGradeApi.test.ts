// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CardboardGrade, CardboardGradeWithProperties } from '@/types';
import { ApiError, setAuthToken } from './httpClient';
import {
	getAll,
	getAllForAdmin,
	create,
	update,
	remove,
} from './cardboardGradeApi';

function mockFetchResponse(data: unknown, status = 200): void {
	vi.spyOn(globalThis, 'fetch').mockResolvedValue({
		ok: true,
		status,
		headers: new Headers({ 'content-length': '1' }),
		json: () => Promise.resolve(data),
	} as Response);
}

function mockFetchEmpty(): void {
	vi.spyOn(globalThis, 'fetch').mockResolvedValue({
		ok: true,
		status: 204,
		headers: new Headers(),
		json: () => Promise.resolve(null),
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

describe('cardboardGradeApi', () => {
	beforeEach(() => {
		setAuthToken(null);
		vi.restoreAllMocks();
	});

	describe('getAll', () => {
		it('должен отправить GET на /api/grades и вернуть список марок', async () => {
			const grades: CardboardGrade[] = [
				{ id: '1', name: 'Т23' },
				{ id: '2', name: 'Т24' },
			];

			mockFetchResponse(grades);

			const result = await getAll();

			expect(result).toEqual(grades);
			expect(globalThis.fetch).toHaveBeenCalledWith('/api/grades', {
				headers: { 'Content-Type': 'application/json' },
			});
		});

		it('должен бросить ApiError при ошибке 500', async () => {
			mockFetchError(500, { message: 'Internal Server Error' });

			await expect(getAll()).rejects.toThrow(ApiError);
			await expect(getAll()).rejects.toMatchObject({ status: 500 });
		});
	});

	describe('getAllForAdmin', () => {
		it('должен отправить GET на /api/grades/admin с Authorization и вернуть полные данные марок', async () => {
			const grades: CardboardGradeWithProperties[] = [
				{
					id: '1',
					name: 'Т23',
					thickness: 3.5,
					crushResistance: 3.8,
				},
			];

			setAuthToken('test-token');
			mockFetchResponse(grades);

			const result = await getAllForAdmin();

			expect(result).toEqual(grades);
			expect(globalThis.fetch).toHaveBeenCalledWith('/api/grades/admin', {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer test-token',
				},
			});
		});
	});

	describe('create', () => {
		it('должен отправить POST с телом и вернуть созданную марку', async () => {
			const payload = {
				name: 'Т25',
				thickness: 5,
				crushResistance: 5.2,
			};

			const created: CardboardGrade = {
				id: '3',
				name: 'Т25',
			};

			mockFetchResponse(created);

			const result = await create(payload);

			expect(result).toEqual(created);
			expect(globalThis.fetch).toHaveBeenCalledWith('/api/grades', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
		});
	});

	describe('update', () => {
		it('должен отправить PUT на /api/grades/:id и вернуть обновлённую марку', async () => {
			const payload = {
				name: 'Т23М',
				thickness: 3.6,
				crushResistance: 3.9,
			};

			const updated: CardboardGrade = {
				id: '1',
				name: 'Т23М',
			};

			mockFetchResponse(updated);

			const result = await update('1', payload);

			expect(result).toEqual(updated);
			expect(globalThis.fetch).toHaveBeenCalledWith('/api/grades/1', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
		});
	});

	describe('remove', () => {
		it('должен отправить DELETE на /api/grades/:id и вернуть undefined', async () => {
			mockFetchEmpty();

			const result = await remove('1');

			expect(result).toBeUndefined();
			expect(globalThis.fetch).toHaveBeenCalledWith('/api/grades/1', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			});
		});
	});
});

// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CardboardGrade } from '@/types';
import { ApiError } from './httpClient';
import { getAll, create, update, remove } from './cardboardGradeApi';

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
		vi.restoreAllMocks();
	});

	describe('getAll', () => {
		it('должен отправить GET на /api/grades и вернуть список марок', async () => {
			const grades: CardboardGrade[] = [
				{ id: '1', name: 'Т-23' },
				{ id: '2', name: 'Т-24' },
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

	describe('create', () => {
		it('должен отправить POST с телом и вернуть созданную марку', async () => {
			const created: CardboardGrade = { id: '3', name: 'Т-25' };
			mockFetchResponse(created);

			const result = await create({ name: 'Т-25' });

			expect(result).toEqual(created);
			expect(globalThis.fetch).toHaveBeenCalledWith('/api/grades', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: 'Т-25' }),
			});
		});
	});

	describe('update', () => {
		it('должен отправить PUT на /api/grades/:id и вернуть обновлённую марку', async () => {
			const updated: CardboardGrade = { id: '1', name: 'Т-23М' };
			mockFetchResponse(updated);

			const result = await update('1', { name: 'Т-23М' });

			expect(result).toEqual(updated);
			expect(globalThis.fetch).toHaveBeenCalledWith('/api/grades/1', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: 'Т-23М' }),
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

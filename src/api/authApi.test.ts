// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { login, logout } from './authApi';

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

describe('authApi', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('login отправляет POST /api/login и возвращает token', async () => {
		mockFetchResponse({
			token: 'test-token',
		});

		const result = await login({
			username: 'admin',
			password: 'admin',
		});

		expect(result).toEqual({
			token: 'test-token',
		});
		expect(globalThis.fetch).toHaveBeenCalledWith('/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: 'admin',
				password: 'admin',
			}),
		});
	});

	it('logout отправляет POST /api/logout', async () => {
		mockFetchEmpty();

		const result = await logout();

		expect(result).toBeUndefined();
		expect(globalThis.fetch).toHaveBeenCalledWith('/api/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
	});
});

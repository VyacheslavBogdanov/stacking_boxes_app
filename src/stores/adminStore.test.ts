import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAdminStore } from './adminStore';
import * as authApi from '@/api/authApi';

vi.mock('@/api/authApi', () => ({
	login: vi.fn(),
	logout: vi.fn(),
}));

describe('adminStore', () => {
	beforeEach(() => {
		localStorage.clear();
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	describe('начальное состояние', () => {
		it('должно иметь isAuthenticated = false если токена нет', () => {
			const store = useAdminStore();

			expect(store.isAuthenticated).toBe(false);
			expect(store.token).toBeNull();
		});

		it('восстанавливает авторизацию из localStorage', () => {
			localStorage.setItem('stacking-boxes-admin-token', 'stored-token');

			setActivePinia(createPinia());

			const store = useAdminStore();

			expect(store.isAuthenticated).toBe(true);
			expect(store.token).toBe('stored-token');
		});
	});

	describe('login', () => {
		it('должен авторизовать при успешном ответе backend и сохранить token', async () => {
			vi.mocked(authApi.login).mockResolvedValue({
				token: 'test-token',
			});

			const store = useAdminStore();

			await store.login({
				username: 'admin',
				password: 'admin',
			});

			expect(authApi.login).toHaveBeenCalledWith({
				username: 'admin',
				password: 'admin',
			});
			expect(store.isAuthenticated).toBe(true);
			expect(store.token).toBe('test-token');
			expect(localStorage.getItem('stacking-boxes-admin-token')).toBe(
				'test-token',
			);
		});

		it('должен оставить isAuthenticated = false при ошибке login', async () => {
			vi.mocked(authApi.login).mockRejectedValue(new Error('Invalid credentials'));

			const store = useAdminStore();

			await expect(
				store.login({
					username: 'admin',
					password: 'wrong',
				}),
			).rejects.toThrow('Invalid credentials');

			expect(store.isAuthenticated).toBe(false);
			expect(store.token).toBeNull();
			expect(localStorage.getItem('stacking-boxes-admin-token')).toBeNull();
		});
	});

	describe('logout', () => {
		it('должен сбросить isAuthenticated, token и localStorage', async () => {
			vi.mocked(authApi.login).mockResolvedValue({
				token: 'test-token',
			});
			vi.mocked(authApi.logout).mockResolvedValue();

			const store = useAdminStore();

			await store.login({
				username: 'admin',
				password: 'admin',
			});

			expect(store.isAuthenticated).toBe(true);
			expect(store.token).toBe('test-token');
			expect(localStorage.getItem('stacking-boxes-admin-token')).toBe(
				'test-token',
			);

			await store.logout();

			expect(authApi.logout).toHaveBeenCalled();
			expect(store.isAuthenticated).toBe(false);
			expect(store.token).toBeNull();
			expect(localStorage.getItem('stacking-boxes-admin-token')).toBeNull();
		});
	});

	describe('clearAuth', () => {
		it('очищает авторизацию без запроса logout', () => {
			localStorage.setItem('stacking-boxes-admin-token', 'stored-token');

			setActivePinia(createPinia());

			const store = useAdminStore();

			expect(store.isAuthenticated).toBe(true);

			store.clearAuth();

			expect(store.isAuthenticated).toBe(false);
			expect(store.token).toBeNull();
			expect(localStorage.getItem('stacking-boxes-admin-token')).toBeNull();
		});
	});
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAdmin } from './useAdmin';
import * as authApi from '@/api/authApi';

vi.mock('@/api/authApi', () => ({
	login: vi.fn(),
	logout: vi.fn(),
}));

describe('useAdmin', () => {
	beforeEach(() => {
		localStorage.clear();
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	describe('начальное состояние', () => {
		it('должно иметь isAuthenticated = false', () => {
			const { isAuthenticated } = useAdmin();

			expect(isAuthenticated.value).toBe(false);
		});

		it('должно иметь loginError = null', () => {
			const { loginError } = useAdmin();

			expect(loginError.value).toBeNull();
		});
	});

	describe('login', () => {
		it('должен авторизовать при успешном login', async () => {
			vi.mocked(authApi.login).mockResolvedValue({
				token: 'test-token',
			});

			const { isAuthenticated, login, loginError } = useAdmin();

			await login({
				username: 'admin',
				password: 'admin',
			});

			expect(isAuthenticated.value).toBe(true);
			expect(loginError.value).toBeNull();
			expect(localStorage.getItem('stacking-boxes-admin-token')).toBe(
				'test-token',
			);
		});

		it('должен записать ошибку при неверных данных', async () => {
			vi.mocked(authApi.login).mockRejectedValue(new Error('Invalid credentials'));

			const { isAuthenticated, loginError, login } = useAdmin();

			await login({
				username: 'wrong',
				password: 'wrong',
			});

			expect(isAuthenticated.value).toBe(false);
			expect(loginError.value).toBe('Неверный логин или пароль');
			expect(localStorage.getItem('stacking-boxes-admin-token')).toBeNull();
		});

		it('должен сбросить loginError при успешном логине после ошибки', async () => {
			const { loginError, login } = useAdmin();

			vi.mocked(authApi.login).mockRejectedValueOnce(new Error('Invalid credentials'));

			await login({
				username: 'wrong',
				password: 'wrong',
			});

			expect(loginError.value).toBe('Неверный логин или пароль');

			vi.mocked(authApi.login).mockResolvedValueOnce({
				token: 'test-token',
			});

			await login({
				username: 'admin',
				password: 'admin',
			});

			expect(loginError.value).toBeNull();
		});
	});

	describe('logout', () => {
		it('должен сбросить isAuthenticated и loginError', async () => {
			vi.mocked(authApi.login).mockResolvedValue({
				token: 'test-token',
			});
			vi.mocked(authApi.logout).mockResolvedValue();

			const { isAuthenticated, loginError, login, logout } = useAdmin();

			vi.mocked(authApi.login).mockRejectedValueOnce(new Error('Invalid credentials'));

			await login({
				username: 'wrong',
				password: 'wrong',
			});

			expect(loginError.value).toBe('Неверный логин или пароль');

			vi.mocked(authApi.login).mockResolvedValueOnce({
				token: 'test-token',
			});

			await login({
				username: 'admin',
				password: 'admin',
			});

			expect(isAuthenticated.value).toBe(true);

			await logout();

			expect(isAuthenticated.value).toBe(false);
			expect(loginError.value).toBeNull();
			expect(localStorage.getItem('stacking-boxes-admin-token')).toBeNull();
		});
	});
});

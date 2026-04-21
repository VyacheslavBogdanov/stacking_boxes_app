import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAdmin } from './useAdmin';

describe('useAdmin', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
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
		it('должен авторизовать при верных данных', () => {
			const { isAuthenticated, login } = useAdmin();

			login({ username: 'admin', password: 'admin' });

			expect(isAuthenticated.value).toBe(true);
		});

		it('должен записать ошибку при неверных данных', () => {
			const { isAuthenticated, loginError, login } = useAdmin();

			login({ username: 'wrong', password: 'wrong' });

			expect(isAuthenticated.value).toBe(false);
			expect(loginError.value).toBe('Неверный логин или пароль');
		});

		it('должен сбросить loginError при успешном логине после ошибки', () => {
			const { loginError, login } = useAdmin();

			login({ username: 'wrong', password: 'wrong' });
			expect(loginError.value).toBe('Неверный логин или пароль');

			login({ username: 'admin', password: 'admin' });
			expect(loginError.value).toBeNull();
		});
	});

	describe('logout', () => {
		it('должен сбросить isAuthenticated и loginError', () => {
			const { isAuthenticated, loginError, login, logout } = useAdmin();

			login({ username: 'wrong', password: 'wrong' });
			expect(loginError.value).toBe('Неверный логин или пароль');

			login({ username: 'admin', password: 'admin' });
			logout();

			expect(isAuthenticated.value).toBe(false);
			expect(loginError.value).toBeNull();
		});
	});
});

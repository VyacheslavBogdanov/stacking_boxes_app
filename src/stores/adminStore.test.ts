import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAdminStore } from './adminStore';

describe('adminStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	describe('начальное состояние', () => {
		it('должно иметь isAuthenticated = false', () => {
			const store = useAdminStore();
			expect(store.isAuthenticated).toBe(false);
		});
	});

	describe('login', () => {
		it('должен авторизовать при верных данных', () => {
			const store = useAdminStore();

			store.login({ username: 'admin', password: 'admin' });

			expect(store.isAuthenticated).toBe(true);
		});

		it('должен бросить ошибку при неверном логине', () => {
			const store = useAdminStore();

			expect(() => store.login({ username: 'wrong', password: 'admin' })).toThrow(
				'Неверный логин или пароль',
			);
			expect(store.isAuthenticated).toBe(false);
		});

		it('должен бросить ошибку при неверном пароле', () => {
			const store = useAdminStore();

			expect(() => store.login({ username: 'admin', password: 'wrong' })).toThrow(
				'Неверный логин или пароль',
			);
			expect(store.isAuthenticated).toBe(false);
		});
	});

	describe('logout', () => {
		it('должен сбросить isAuthenticated в false', () => {
			const store = useAdminStore();
			store.login({ username: 'admin', password: 'admin' });
			expect(store.isAuthenticated).toBe(true);

			store.logout();

			expect(store.isAuthenticated).toBe(false);
		});
	});
});

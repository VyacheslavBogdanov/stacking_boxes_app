import { ref } from 'vue';
import { defineStore } from 'pinia';

export interface LoginCredentials {
	username: string;
	password: string;
}

// TODO: заменить на вызов authApi после реализации Задачи 12 (бэкенд auth)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

export const useAdminStore = defineStore('admin', () => {
	const isAuthenticated = ref(false);

	function login(credentials: LoginCredentials): void {
		if (credentials.username !== ADMIN_USERNAME || credentials.password !== ADMIN_PASSWORD) {
			throw new Error('Неверный логин или пароль');
		}
		isAuthenticated.value = true;
	}

	function logout(): void {
		isAuthenticated.value = false;
	}

	return {
		isAuthenticated,
		login,
		logout,
	};
});

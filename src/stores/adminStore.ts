import { ref } from 'vue';
import { defineStore } from 'pinia';
import * as authApi from '@/api/authApi';
import { setAuthToken } from '@/api/httpClient';
import type { LoginCredentials } from '@/api/authApi';

export type { LoginCredentials };

const ADMIN_TOKEN_STORAGE_KEY = 'stacking-boxes-admin-token';

function readTokenFromStorage(): string | null {
	return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
}

function writeTokenToStorage(token: string): void {
	localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
}

function removeTokenFromStorage(): void {
	localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
}

export const useAdminStore = defineStore('admin', () => {
	const initialToken = readTokenFromStorage();

	const isAuthenticated = ref(Boolean(initialToken));
	const token = ref<string | null>(initialToken);

	if (initialToken) {
		setAuthToken(initialToken);
	}

	async function login(credentials: LoginCredentials): Promise<void> {
		const response = await authApi.login(credentials);

		token.value = response.token;
		setAuthToken(response.token);
		writeTokenToStorage(response.token);
		isAuthenticated.value = true;
	}

	async function logout(): Promise<void> {
		try {
			await authApi.logout();
		} finally {
			token.value = null;
			setAuthToken(null);
			removeTokenFromStorage();
			isAuthenticated.value = false;
		}
	}

	function clearAuth(): void {
		token.value = null;
		setAuthToken(null);
		removeTokenFromStorage();
		isAuthenticated.value = false;
	}

	return {
		isAuthenticated,
		token,
		login,
		logout,
		clearAuth,
	};
});

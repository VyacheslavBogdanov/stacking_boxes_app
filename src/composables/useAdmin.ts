import { readonly, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAdminStore } from '@/stores/adminStore';
import type { LoginCredentials } from '@/stores/adminStore';

export type { LoginCredentials };

export function useAdmin() {
	const store = useAdminStore();
	const { isAuthenticated, token } = storeToRefs(store);
	const loginError = ref<string | null>(null);
	const isLoading = ref(false);

	async function login(credentials: LoginCredentials): Promise<void> {
		isLoading.value = true;
		loginError.value = null;

		try {
			await store.login(credentials);
		} catch {
			loginError.value = 'Неверный логин или пароль';
		} finally {
			isLoading.value = false;
		}
	}

	async function logout(): Promise<void> {
		await store.logout();
		loginError.value = null;
	}

	function clearAuth(): void {
		store.clearAuth();
		loginError.value = null;
	}

	return {
		isAuthenticated: readonly(isAuthenticated),
		token: readonly(token),
		loginError: readonly(loginError),
		isLoading: readonly(isLoading),
		login,
		logout,
		clearAuth,
	};
}

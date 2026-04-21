import { readonly, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAdminStore } from '@/stores/adminStore';
import type { LoginCredentials } from '@/stores/adminStore';

export type { LoginCredentials };

export function useAdmin() {
	const store = useAdminStore();
	const { isAuthenticated } = storeToRefs(store);
	const loginError = ref<string | null>(null);

	function login(credentials: LoginCredentials): void {
		try {
			store.login(credentials);
			loginError.value = null;
		} catch (e) {
			loginError.value = e instanceof Error ? e.message : 'Неизвестная ошибка';
		}
	}

	function logout(): void {
		store.logout();
		loginError.value = null;
	}

	return {
		isAuthenticated: readonly(isAuthenticated),
		loginError: readonly(loginError),
		login,
		logout,
	};
}

import { readonly, ref } from 'vue';
import type { BoxParams, CalculationResult } from '@/types';
import * as calculationApi from '@/api/calculationApi';

function getErrorMessage(e: unknown): string {
	return e instanceof Error ? e.message : 'Неизвестная ошибка';
}

export function useStackCalculation() {
	const result = ref<CalculationResult | null>(null);
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	async function calculate(params: BoxParams): Promise<void> {
		isLoading.value = true;
		error.value = null;
		try {
			result.value = await calculationApi.calculate(params);
		} catch (e) {
			error.value = getErrorMessage(e);
		} finally {
			isLoading.value = false;
		}
	}

	function reset(): void {
		result.value = null;
		isLoading.value = false;
		error.value = null;
	}

	return {
		result: readonly(result),
		isLoading: readonly(isLoading),
		error: readonly(error),
		calculate,
		reset,
	};
}

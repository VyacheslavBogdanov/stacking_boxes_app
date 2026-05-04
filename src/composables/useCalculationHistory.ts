import { readonly } from 'vue';
import { storeToRefs } from 'pinia';
import { useCalculationHistoryStore } from '@/stores/calculationHistoryStore';
import type { BoxParams, CalculationResult } from '@/types';

interface AddHistoryItemPayload {
	params: BoxParams;
	gradeName: string;
	result: CalculationResult;
}

export function useCalculationHistory() {
	const store = useCalculationHistoryStore();
	const { items, selectedItem } = storeToRefs(store);

	function addItem(payload: AddHistoryItemPayload): void {
		store.addItem(payload);
	}

	function selectItem(id: string): void {
		store.selectItem(id);
	}

	function clearSelectedItem(): void {
		store.clearSelectedItem();
	}

	function clearHistory(): void {
		store.clearHistory();
	}

	return {
		items: readonly(items),
		selectedItem: readonly(selectedItem),
		addItem,
		selectItem,
		clearSelectedItem,
		clearHistory,
	};
}

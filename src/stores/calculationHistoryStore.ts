import { ref } from 'vue';
import { defineStore } from 'pinia';
import type {
	BoxParams,
	CalculationHistoryItem,
	CalculationResult,
} from '@/types';

const MAX_HISTORY_ITEMS = 10;
const HISTORY_STORAGE_KEY = 'stacking-boxes-calculation-history';

interface AddHistoryItemPayload {
	params: BoxParams;
	gradeName: string;
	result: CalculationResult;
}

function createHistoryItem(
	payload: AddHistoryItemPayload,
): CalculationHistoryItem {
	return {
		id: crypto.randomUUID(),
		createdAt: new Date().toISOString(),
		params: payload.params,
		gradeName: payload.gradeName,
		result: payload.result,
	};
}

function readHistoryFromStorage(): CalculationHistoryItem[] {
	try {
		const raw = localStorage.getItem(HISTORY_STORAGE_KEY);

		if (!raw) {
			return [];
		}

		const parsed: unknown = JSON.parse(raw);

		if (!Array.isArray(parsed)) {
			return [];
		}

		return parsed.slice(0, MAX_HISTORY_ITEMS) as CalculationHistoryItem[];
	} catch {
		return [];
	}
}

function writeHistoryToStorage(items: CalculationHistoryItem[]): void {
	localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
}

function removeHistoryFromStorage(): void {
	localStorage.removeItem(HISTORY_STORAGE_KEY);
}

export const useCalculationHistoryStore = defineStore(
	'calculationHistory',
	() => {
		const items = ref<CalculationHistoryItem[]>(readHistoryFromStorage());
		const selectedItem = ref<CalculationHistoryItem | null>(null);

		function addItem(payload: AddHistoryItemPayload): void {
			const item = createHistoryItem(payload);

			items.value = [item, ...items.value].slice(0, MAX_HISTORY_ITEMS);
			selectedItem.value = item;

			writeHistoryToStorage(items.value);
		}

		function selectItem(id: string): void {
			selectedItem.value =
				items.value.find((item) => item.id === id) ?? null;
		}

		function clearSelectedItem(): void {
			selectedItem.value = null;
		}

		function clearHistory(): void {
			items.value = [];
			selectedItem.value = null;

			removeHistoryFromStorage();
		}

		return {
			items,
			selectedItem,
			addItem,
			selectItem,
			clearSelectedItem,
			clearHistory,
		};
	},
);

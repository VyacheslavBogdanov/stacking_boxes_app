import { readonly } from 'vue';
import { storeToRefs } from 'pinia';
import { useCardboardGradeStore } from '@/stores/cardboardGradeStore';
import type { CardboardGrade } from '@/types';

export function useCardboardGrades() {
	const store = useCardboardGradeStore();
	const { grades, isLoading, error } = storeToRefs(store);

	function fetchGrades(): Promise<void> {
		return store.fetchGrades();
	}

	function addGrade(grade: Omit<CardboardGrade, 'id'>): Promise<void> {
		return store.addGrade(grade);
	}

	function updateGrade(id: string, grade: Omit<CardboardGrade, 'id'>): Promise<void> {
		return store.updateGrade(id, grade);
	}

	function removeGrade(id: string): Promise<void> {
		return store.removeGrade(id);
	}

	return {
		grades: readonly(grades),
		isLoading: readonly(isLoading),
		error: readonly(error),
		fetchGrades,
		addGrade,
		updateGrade,
		removeGrade,
	};
}

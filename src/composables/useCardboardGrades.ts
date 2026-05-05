import { readonly } from 'vue';
import { storeToRefs } from 'pinia';
import { useCardboardGradeStore } from '@/stores/cardboardGradeStore';
import type { CardboardGradePayload } from '@/types';

export function useCardboardGrades() {
	const store = useCardboardGradeStore();
	const { grades, adminGrades, isLoading, error } = storeToRefs(store);

	function fetchGrades(): Promise<void> {
		return store.fetchGrades();
	}

	function fetchAdminGrades(): Promise<void> {
		return store.fetchAdminGrades();
	}

	function addGrade(grade: CardboardGradePayload): Promise<void> {
		return store.addGrade(grade);
	}

	function updateGrade(
		id: string,
		grade: CardboardGradePayload,
	): Promise<void> {
		return store.updateGrade(id, grade);
	}

	function removeGrade(id: string): Promise<void> {
		return store.removeGrade(id);
	}

	return {
		grades: readonly(grades),
		adminGrades: readonly(adminGrades),
		isLoading: readonly(isLoading),
		error: readonly(error),
		fetchGrades,
		fetchAdminGrades,
		addGrade,
		updateGrade,
		removeGrade,
	};
}

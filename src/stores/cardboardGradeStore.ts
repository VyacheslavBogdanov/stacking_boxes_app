import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { CardboardGrade } from '@/types';
import * as cardboardGradeApi from '@/api/cardboardGradeApi';

function getErrorMessage(e: unknown): string {
	return e instanceof Error ? e.message : 'Неизвестная ошибка';
}

export const useCardboardGradeStore = defineStore('cardboardGrade', () => {
	const grades = ref<CardboardGrade[]>([]);
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	async function fetchGrades(): Promise<void> {
		isLoading.value = true;
		error.value = null;
		try {
			grades.value = await cardboardGradeApi.getAll();
		} catch (e) {
			error.value = getErrorMessage(e);
			throw e;
		} finally {
			isLoading.value = false;
		}
	}

	async function addGrade(grade: Omit<CardboardGrade, 'id'>): Promise<void> {
		try {
			const created = await cardboardGradeApi.create(grade);
			grades.value.push(created);
		} catch (e) {
			error.value = getErrorMessage(e);
			throw e;
		}
	}

	async function updateGrade(id: string, grade: Omit<CardboardGrade, 'id'>): Promise<void> {
		try {
			const updated = await cardboardGradeApi.update(id, grade);
			const index = grades.value.findIndex((g) => g.id === id);
			if (index !== -1) {
				grades.value[index] = updated;
			}
		} catch (e) {
			error.value = getErrorMessage(e);
			throw e;
		}
	}

	async function removeGrade(id: string): Promise<void> {
		try {
			await cardboardGradeApi.remove(id);
			grades.value = grades.value.filter((g) => g.id !== id);
		} catch (e) {
			error.value = getErrorMessage(e);
			throw e;
		}
	}

	return {
		grades,
		isLoading,
		error,
		fetchGrades,
		addGrade,
		updateGrade,
		removeGrade,
	};
});

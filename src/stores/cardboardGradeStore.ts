import { ref } from 'vue';
import { defineStore } from 'pinia';
import type {
	CardboardGrade,
	CardboardGradePayload,
	CardboardGradeWithProperties,
} from '@/types';
import * as cardboardGradeApi from '@/api/cardboardGradeApi';

function getErrorMessage(e: unknown): string {
	return e instanceof Error ? e.message : 'Неизвестная ошибка';
}

export const useCardboardGradeStore = defineStore('cardboardGrade', () => {
	const grades = ref<CardboardGrade[]>([]);
	const adminGrades = ref<CardboardGradeWithProperties[]>([]);
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

	async function fetchAdminGrades(): Promise<void> {
		isLoading.value = true;
		error.value = null;

		try {
			adminGrades.value = await cardboardGradeApi.getAllForAdmin();
		} catch (e) {
			error.value = getErrorMessage(e);
			throw e;
		} finally {
			isLoading.value = false;
		}
	}

	async function addGrade(grade: CardboardGradePayload): Promise<void> {
		try {
			const created = await cardboardGradeApi.create(grade);

			grades.value.push(created);
			adminGrades.value.push({
				...created,
				thickness: grade.thickness,
				crushResistance: grade.crushResistance,
			});
		} catch (e) {
			error.value = getErrorMessage(e);
			throw e;
		}
	}

	async function updateGrade(
		id: string,
		grade: CardboardGradePayload,
	): Promise<void> {
		try {
			const updated = await cardboardGradeApi.update(id, grade);
			const gradeIndex = grades.value.findIndex((g) => g.id === id);
			const adminGradeIndex = adminGrades.value.findIndex((g) => g.id === id);

			if (gradeIndex !== -1) {
				grades.value[gradeIndex] = updated;
			}

			if (adminGradeIndex !== -1) {
				adminGrades.value[adminGradeIndex] = {
					...updated,
					thickness: grade.thickness,
					crushResistance: grade.crushResistance,
				};
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
			adminGrades.value = adminGrades.value.filter((g) => g.id !== id);
		} catch (e) {
			error.value = getErrorMessage(e);
			throw e;
		}
	}

	return {
		grades,
		adminGrades,
		isLoading,
		error,
		fetchGrades,
		fetchAdminGrades,
		addGrade,
		updateGrade,
		removeGrade,
	};
});

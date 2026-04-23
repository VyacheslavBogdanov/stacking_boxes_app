import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCardboardGrades } from './useCardboardGrades';
import type { CardboardGrade } from '@/types';

vi.mock('@/api/cardboardGradeApi');

const cardboardGradeApi = vi.mocked(await import('@/api/cardboardGradeApi'));

const MOCK_GRADE: CardboardGrade = { id: '1', name: 'Т-23' };
const MOCK_GRADES: CardboardGrade[] = [MOCK_GRADE, { id: '2', name: 'Т-24' }];

describe('useCardboardGrades', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	describe('начальное состояние', () => {
		it('должно иметь пустой массив grades', () => {
			const { grades } = useCardboardGrades();
			expect(grades.value).toEqual([]);
		});

		it('должно иметь isLoading = false', () => {
			const { isLoading } = useCardboardGrades();
			expect(isLoading.value).toBe(false);
		});

		it('должно иметь error = null', () => {
			const { error } = useCardboardGrades();
			expect(error.value).toBeNull();
		});
	});

	describe('fetchGrades', () => {
		it('должен загрузить марки через стор', async () => {
			cardboardGradeApi.getAll.mockResolvedValue(MOCK_GRADES);
			const { grades, fetchGrades } = useCardboardGrades();

			await fetchGrades();

			expect(cardboardGradeApi.getAll).toHaveBeenCalledOnce();
			expect(grades.value).toEqual(MOCK_GRADES);
		});
	});

	describe('addGrade', () => {
		it('должен добавить марку через стор', async () => {
			const newGrade = { name: 'Т-25' };
			const createdGrade: CardboardGrade = { id: '3', ...newGrade };
			cardboardGradeApi.create.mockResolvedValue(createdGrade);
			const { grades, addGrade } = useCardboardGrades();

			await addGrade(newGrade);

			expect(cardboardGradeApi.create).toHaveBeenCalledWith(newGrade);
			expect(grades.value).toEqual([createdGrade]);
		});
	});

	describe('updateGrade', () => {
		it('должен обновить марку через стор', async () => {
			cardboardGradeApi.getAll.mockResolvedValue([...MOCK_GRADES]);
			const updatedData = { name: 'Т-23 обновлённый' };
			const updatedGrade: CardboardGrade = { id: '1', ...updatedData };
			cardboardGradeApi.update.mockResolvedValue(updatedGrade);
			const { grades, fetchGrades, updateGrade } = useCardboardGrades();

			await fetchGrades();
			await updateGrade('1', updatedData);

			expect(cardboardGradeApi.update).toHaveBeenCalledWith('1', updatedData);
			expect(grades.value[0]).toEqual(updatedGrade);
		});
	});

	describe('removeGrade', () => {
		it('должен удалить марку через стор', async () => {
			cardboardGradeApi.getAll.mockResolvedValue([...MOCK_GRADES]);
			cardboardGradeApi.remove.mockResolvedValue(undefined);
			const { grades, fetchGrades, removeGrade } = useCardboardGrades();

			await fetchGrades();
			await removeGrade('1');

			expect(cardboardGradeApi.remove).toHaveBeenCalledWith('1');
			expect(grades.value).toEqual([MOCK_GRADES[1]]);
		});
	});
});

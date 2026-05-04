import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCardboardGradeStore } from './cardboardGradeStore';
import type { CardboardGrade, CardboardGradePayload } from '@/types';

vi.mock('@/api/cardboardGradeApi');

const cardboardGradeApi = vi.mocked(await import('@/api/cardboardGradeApi'));

const MOCK_GRADE: CardboardGrade = {
	id: '1',
	name: 'Т23',
};

const MOCK_GRADES: CardboardGrade[] = [
	MOCK_GRADE,
	{
		id: '2',
		name: 'Т24',
	},
];

const CREATE_PAYLOAD: CardboardGradePayload = {
	name: 'Т25',
	thickness: 5,
	crushResistance: 5.2,
};

const UPDATE_PAYLOAD: CardboardGradePayload = {
	name: 'Т23 обновлённый',
	thickness: 3.6,
	crushResistance: 3.9,
};

describe('cardboardGradeStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	describe('начальное состояние', () => {
		it('должно иметь пустой массив grades', () => {
			const store = useCardboardGradeStore();

			expect(store.grades).toEqual([]);
		});

		it('должно иметь isLoading = false', () => {
			const store = useCardboardGradeStore();

			expect(store.isLoading).toBe(false);
		});

		it('должно иметь error = null', () => {
			const store = useCardboardGradeStore();

			expect(store.error).toBeNull();
		});
	});

	describe('fetchGrades', () => {
		it('должен загрузить марки и записать в grades', async () => {
			cardboardGradeApi.getAll.mockResolvedValue(MOCK_GRADES);

			const store = useCardboardGradeStore();

			await store.fetchGrades();

			expect(cardboardGradeApi.getAll).toHaveBeenCalledOnce();
			expect(store.grades).toEqual(MOCK_GRADES);
		});

		it('должен устанавливать isLoading во время загрузки', async () => {
			let resolvePromise!: (value: CardboardGrade[]) => void;

			cardboardGradeApi.getAll.mockReturnValue(
				new Promise((resolve) => {
					resolvePromise = resolve;
				}),
			);

			const store = useCardboardGradeStore();

			const promise = store.fetchGrades();

			expect(store.isLoading).toBe(true);

			resolvePromise(MOCK_GRADES);
			await promise;

			expect(store.isLoading).toBe(false);
		});

		it('должен записать ошибку при неудаче', async () => {
			cardboardGradeApi.getAll.mockRejectedValue(new Error('Ошибка сети'));

			const store = useCardboardGradeStore();

			await expect(store.fetchGrades()).rejects.toThrow('Ошибка сети');

			expect(store.error).toBe('Ошибка сети');
			expect(store.isLoading).toBe(false);
		});

		it('должен сбрасывать error при успешной загрузке', async () => {
			cardboardGradeApi.getAll.mockRejectedValueOnce(new Error('Ошибка'));

			const store = useCardboardGradeStore();

			await expect(store.fetchGrades()).rejects.toThrow();

			expect(store.error).toBe('Ошибка');

			cardboardGradeApi.getAll.mockResolvedValue(MOCK_GRADES);

			await store.fetchGrades();

			expect(store.error).toBeNull();
		});
	});

	describe('addGrade', () => {
		it('должен создать марку через API и добавить в массив', async () => {
			const createdGrade: CardboardGrade = {
				id: '3',
				name: CREATE_PAYLOAD.name,
			};

			cardboardGradeApi.create.mockResolvedValue(createdGrade);

			const store = useCardboardGradeStore();

			await store.addGrade(CREATE_PAYLOAD);

			expect(cardboardGradeApi.create).toHaveBeenCalledWith(CREATE_PAYLOAD);
			expect(store.grades).toEqual([createdGrade]);
		});

		it('должен записать ошибку при неудаче', async () => {
			cardboardGradeApi.create.mockRejectedValue(
				new Error('Ошибка создания'),
			);

			const store = useCardboardGradeStore();

			await expect(store.addGrade(CREATE_PAYLOAD)).rejects.toThrow(
				'Ошибка создания',
			);

			expect(store.error).toBe('Ошибка создания');
		});
	});

	describe('updateGrade', () => {
		it('должен обновить марку через API и заменить в массиве', async () => {
			const updatedGrade: CardboardGrade = {
				id: '1',
				name: UPDATE_PAYLOAD.name,
			};

			cardboardGradeApi.update.mockResolvedValue(updatedGrade);

			const store = useCardboardGradeStore();

			store.grades = [...MOCK_GRADES];

			await store.updateGrade('1', UPDATE_PAYLOAD);

			expect(cardboardGradeApi.update).toHaveBeenCalledWith(
				'1',
				UPDATE_PAYLOAD,
			);
			expect(store.grades[0]).toEqual(updatedGrade);
			expect(store.grades[1]).toEqual(MOCK_GRADES[1]);
		});

		it('должен записать ошибку при неудаче', async () => {
			cardboardGradeApi.update.mockRejectedValue(
				new Error('Ошибка обновления'),
			);

			const store = useCardboardGradeStore();

			await expect(store.updateGrade('1', UPDATE_PAYLOAD)).rejects.toThrow(
				'Ошибка обновления',
			);

			expect(store.error).toBe('Ошибка обновления');
		});
	});

	describe('removeGrade', () => {
		it('должен удалить марку через API и убрать из массива', async () => {
			cardboardGradeApi.remove.mockResolvedValue(undefined);

			const store = useCardboardGradeStore();

			store.grades = [...MOCK_GRADES];

			await store.removeGrade('1');

			expect(cardboardGradeApi.remove).toHaveBeenCalledWith('1');
			expect(store.grades).toEqual([MOCK_GRADES[1]]);
		});

		it('должен записать ошибку при неудаче', async () => {
			cardboardGradeApi.remove.mockRejectedValue(
				new Error('Ошибка удаления'),
			);

			const store = useCardboardGradeStore();

			await expect(store.removeGrade('1')).rejects.toThrow(
				'Ошибка удаления',
			);

			expect(store.error).toBe('Ошибка удаления');
		});
	});
});

import { describe, expect, it } from 'vitest';
import type { BoxParams, GradeProperties } from '@/types';
import { calculateStacking } from './stackCalculation';

describe('calculateStacking', () => {
	it('считает результат по формулам из Калькулятор.xlsx для марки Т23', () => {
		const params: BoxParams = {
			length: 447,
			width: 305,
			height: 110,
			grossWeight: 2,
			gradeId: '2',
		};

		const grade: GradeProperties = {
			thickness: 3.5,
			crushResistance: 3.8,
		};

		const result = calculateStacking(params, grade);

		expect(result).toEqual({
			maxStackHeight: 2016,
			rowCount: 18,
			maxWeightPerBox: 34,
		});
	});
});

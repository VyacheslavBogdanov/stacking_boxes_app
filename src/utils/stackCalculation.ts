import type { BoxParams, CalculationResult, GradeProperties } from '@/types';
import {
	GRAVITY_ACCELERATION,
	MCKEE_COEFFICIENT,
	STACK_HEIGHT_REDUCTION_FACTOR,
	STORAGE_SAFETY_FACTOR,
} from './constants';

function quotient(dividend: number, divisor: number): number {
	return Math.trunc(dividend / divisor);
}

export function calculateStacking(
	params: BoxParams,
	grade: GradeProperties,
): CalculationResult {
	const perimeter = (params.length + params.width) * 2;

	const sqrtThicknessPerimeter = Math.sqrt(grade.thickness * perimeter);

	const compressiveForceFromWeight =
		STORAGE_SAFETY_FACTOR * GRAVITY_ACCELERATION * params.grossWeight;

	const compressionCapacity =
		MCKEE_COEFFICIENT *
		grade.crushResistance *
		sqrtThicknessPerimeter *
		params.height;

	const partialHeight = quotient(
		compressionCapacity,
		compressiveForceFromWeight,
	);

	const fullHeight = partialHeight + params.height;

	const maxStackHeight =
		fullHeight - fullHeight * STACK_HEIGHT_REDUCTION_FACTOR;

	const rowCount = quotient(maxStackHeight, params.height);

	const maxWeightPerBox = (rowCount - 1) * params.grossWeight;

	return {
		maxStackHeight,
		rowCount,
		maxWeightPerBox,
	};
}

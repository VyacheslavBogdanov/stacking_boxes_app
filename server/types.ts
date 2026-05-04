import type { BoxParams } from '../src/types/boxParams';
import type { CalculationResult } from '../src/types/calculationResult';
import type { CardboardGrade } from '../src/types/cardboardGrade';
import type { GradeProperties } from '../src/types/gradeProperties';

export type {
	BoxParams,
	CalculationResult,
	CardboardGrade,
	GradeProperties,
};

export type GradePropertiesMap = Record<string, GradeProperties>;

export interface CardboardGradeWithProperties extends CardboardGrade {
	thickness: number;
	crushResistance: number;
}

export interface LoginRequestBody {
	username: string;
	password: string;
}

export interface AuthPayload {
	sub: string;
}

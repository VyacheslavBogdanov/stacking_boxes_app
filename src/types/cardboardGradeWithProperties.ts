import type { CardboardGrade } from './cardboardGrade';
import type { GradeProperties } from './gradeProperties';

export interface CardboardGradeWithProperties
	extends CardboardGrade,
		GradeProperties {}

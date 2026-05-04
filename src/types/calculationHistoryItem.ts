import type { BoxParams } from './boxParams';
import type { CalculationResult } from './calculationResult';

export interface CalculationHistoryItem {
	id: string;
	createdAt: string;
	params: BoxParams;
	gradeName: string;
	result: CalculationResult;
}

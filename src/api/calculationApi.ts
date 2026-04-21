import type { BoxParams, CalculationResult } from '@/types';
import { request } from './httpClient';

export function calculate(params: BoxParams): Promise<CalculationResult> {
	return request<CalculationResult>('/calculate', {
		method: 'POST',
		body: JSON.stringify(params),
	});
}

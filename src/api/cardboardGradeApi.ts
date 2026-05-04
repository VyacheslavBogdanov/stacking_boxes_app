import type {
	CardboardGrade,
	CardboardGradePayload,
	CardboardGradeWithProperties,
} from '@/types';
import { request } from './httpClient';

export function getAll(): Promise<CardboardGrade[]> {
	return request<CardboardGrade[]>('/grades');
}

export function getAllForAdmin(): Promise<CardboardGradeWithProperties[]> {
	return request<CardboardGradeWithProperties[]>('/grades/admin');
}

export function create(
	grade: CardboardGradePayload,
): Promise<CardboardGrade> {
	return request<CardboardGrade>('/grades', {
		method: 'POST',
		body: JSON.stringify(grade),
	});
}

export function update(
	id: string,
	grade: CardboardGradePayload,
): Promise<CardboardGrade> {
	return request<CardboardGrade>(`/grades/${id}`, {
		method: 'PUT',
		body: JSON.stringify(grade),
	});
}

export function remove(id: string): Promise<void> {
	return request<void>(`/grades/${id}`, {
		method: 'DELETE',
	});
}

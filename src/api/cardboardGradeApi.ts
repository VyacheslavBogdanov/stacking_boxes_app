import type { CardboardGrade } from '@/types';
import { request } from './httpClient';

export function getAll(): Promise<CardboardGrade[]> {
	return request<CardboardGrade[]>('/grades');
}

export function create(grade: Omit<CardboardGrade, 'id'>): Promise<CardboardGrade> {
	return request<CardboardGrade>('/grades', {
		method: 'POST',
		body: JSON.stringify(grade),
	});
}

export function update(id: string, grade: Omit<CardboardGrade, 'id'>): Promise<CardboardGrade> {
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

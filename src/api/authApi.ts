import { request } from './httpClient';

export interface LoginCredentials {
	username: string;
	password: string;
}

export interface LoginResponse {
	token: string;
}

export function login(credentials: LoginCredentials): Promise<LoginResponse> {
	return request<LoginResponse>('/login', {
		method: 'POST',
		body: JSON.stringify(credentials),
	});
}

export function logout(): Promise<void> {
	return request<void>('/logout', {
		method: 'POST',
	});
}

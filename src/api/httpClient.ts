const BASE_URL = '/api';

let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
	authToken = token;
}

export class ApiError extends Error {
	status: number;
	body: unknown;

	constructor(status: number, body: unknown) {
		super(`Request failed with status ${status}`);
		this.name = 'ApiError';
		this.status = status;
		this.body = body;
	}
}

export async function request<T>(url: string, options?: RequestInit): Promise<T> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	if (authToken) {
		headers.Authorization = `Bearer ${authToken}`;
	}

	const response = await fetch(`${BASE_URL}${url}`, {
		...options,
		headers: {
			...headers,
			...options?.headers,
		},
	});

	if (!response.ok) {
		const body: unknown = await response.json().catch(() => null);
		throw new ApiError(response.status, body);
	}

	if (response.status === 204 || response.headers.get('content-length') === '0') {
		return undefined as T;
	}

	return response.json() as Promise<T>;
}

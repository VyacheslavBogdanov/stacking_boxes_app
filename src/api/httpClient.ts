const BASE_URL = '/api';

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
	const response = await fetch(`${BASE_URL}${url}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
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

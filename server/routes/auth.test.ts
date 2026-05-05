// @vitest-environment node

import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../app';

describe('authRouter', () => {
	it('POST /login возвращает JWT-токен для правильных данных', async () => {
		const response = await request(app).post('/login').send({
			username: 'admin',
			password: 'admin',
		});

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			token: expect.any(String),
		});
	});

	it('POST /login возвращает 401 для неправильного пароля', async () => {
		const response = await request(app).post('/login').send({
			username: 'admin',
			password: 'wrong-password',
		});

		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			message: 'Invalid credentials',
		});
	});

	it('POST /login возвращает 400 если не передан пароль', async () => {
		const response = await request(app).post('/login').send({
			username: 'admin',
		});

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			message: 'Username and password are required',
		});
	});

	it('POST /logout возвращает 204', async () => {
		const response = await request(app).post('/logout');

		expect(response.status).toBe(204);
		expect(response.body).toEqual({});
	});
});

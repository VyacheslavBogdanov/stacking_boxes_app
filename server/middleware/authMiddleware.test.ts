// @vitest-environment node

import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config';
import { authMiddleware } from './authMiddleware';

const app = express();

app.get('/protected', authMiddleware, (_req, res) => {
	res.json({
		status: 'ok',
	});
});

describe('authMiddleware', () => {
	it('пропускает запрос с валидным JWT', async () => {
		const token = jwt.sign(
			{
				sub: 'admin',
			},
			JWT_SECRET,
			{
				expiresIn: JWT_EXPIRES_IN,
			},
		);

		const response = await request(app)
			.get('/protected')
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			status: 'ok',
		});
	});

	it('возвращает 401 если Authorization header отсутствует', async () => {
		const response = await request(app).get('/protected');

		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			message: 'Unauthorized',
		});
	});

	it('возвращает 401 если токен невалидный', async () => {
		const response = await request(app)
			.get('/protected')
			.set('Authorization', 'Bearer invalid-token');

		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			message: 'Unauthorized',
		});
	});
});

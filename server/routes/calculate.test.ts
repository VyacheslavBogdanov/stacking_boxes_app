// @vitest-environment node

import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../app';

describe('calculateRouter', () => {
	it('POST /calculate возвращает результат расчёта для марки Т23', async () => {
		const response = await request(app).post('/calculate').send({
			length: 447,
			width: 305,
			height: 110,
			grossWeight: 2,
			gradeId: '2',
		});

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			maxStackHeight: 2016,
			rowCount: 18,
			maxWeightPerBox: 34,
		});
	});

	it('POST /calculate возвращает 400 для неизвестной марки картона', async () => {
		const response = await request(app).post('/calculate').send({
			length: 447,
			width: 305,
			height: 110,
			grossWeight: 2,
			gradeId: 'unknown',
		});

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			message: 'Unknown cardboard grade',
		});
	});
});

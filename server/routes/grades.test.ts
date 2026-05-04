// @vitest-environment node

import jwt from 'jsonwebtoken';
import path from 'node:path';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config';
import { readJsonFile, writeJsonFile } from '../helpers/jsonStore';
import type {
	CardboardGrade,
	CardboardGradeWithProperties,
	GradePropertiesMap,
} from '../types';
import { app } from '../app';

const gradesFilePath = path.resolve(process.cwd(), 'server/data/grades.json');

const gradePropertiesFilePath = path.resolve(
	process.cwd(),
	'server/data/gradeProperties.json',
);

const initialGrades: CardboardGrade[] = [
	{
		id: '1',
		name: 'Т11',
	},
	{
		id: '2',
		name: 'Т23',
	},
	{
		id: '3',
		name: 'Т24',
	},
];

const initialGradeProperties: GradePropertiesMap = {
	'1': {
		thickness: 1.6,
		crushResistance: 3,
	},
	'2': {
		thickness: 3.5,
		crushResistance: 3.8,
	},
	'3': {
		thickness: 4.4,
		crushResistance: 4.6,
	},
};

const initialAdminGrades: CardboardGradeWithProperties[] = [
	{
		id: '1',
		name: 'Т11',
		thickness: 1.6,
		crushResistance: 3,
	},
	{
		id: '2',
		name: 'Т23',
		thickness: 3.5,
		crushResistance: 3.8,
	},
	{
		id: '3',
		name: 'Т24',
		thickness: 4.4,
		crushResistance: 4.6,
	},
];

async function resetDataFiles(): Promise<void> {
	await Promise.all([
		writeJsonFile(gradesFilePath, initialGrades),
		writeJsonFile(gradePropertiesFilePath, initialGradeProperties),
	]);
}

function createAuthHeader(): string {
	const token = jwt.sign(
		{
			sub: 'admin',
		},
		JWT_SECRET,
		{
			expiresIn: JWT_EXPIRES_IN,
		},
	);

	return `Bearer ${token}`;
}

describe('gradesRouter', () => {
	beforeEach(async () => {
		await resetDataFiles();
	});

	afterEach(async () => {
		await resetDataFiles();
	});

	it('GET /grades возвращает список марок картона', async () => {
		const response = await request(app).get('/grades');

		expect(response.status).toBe(200);
		expect(response.body).toEqual(initialGrades);
	});

	it('GET /grades/admin возвращает полные данные марок картона с JWT', async () => {
		const response = await request(app)
			.get('/grades/admin')
			.set('Authorization', createAuthHeader());

		expect(response.status).toBe(200);
		expect(response.body).toEqual(initialAdminGrades);
	});

	it('GET /grades/admin возвращает 401 без JWT', async () => {
		const response = await request(app).get('/grades/admin');

		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			message: 'Unauthorized',
		});
	});

	it('POST /grades создаёт новую марку картона', async () => {
		const response = await request(app)
			.post('/grades')
			.set('Authorization', createAuthHeader())
			.send({
				name: 'Т25',
				thickness: 5,
				crushResistance: 5.2,
			});

		expect(response.status).toBe(201);
		expect(response.body).toEqual({
			id: expect.any(String),
			name: 'Т25',
		});

		const grades = await readJsonFile<CardboardGrade[]>(gradesFilePath);

		expect(grades).toContainEqual(response.body);

		const gradeProperties =
			await readJsonFile<GradePropertiesMap>(gradePropertiesFilePath);

		expect(gradeProperties[response.body.id]).toEqual({
			thickness: 5,
			crushResistance: 5.2,
		});
	});

	it('POST /grades возвращает 401 без JWT', async () => {
		const response = await request(app).post('/grades').send({
			name: 'Т25',
			thickness: 5,
			crushResistance: 5.2,
		});

		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			message: 'Unauthorized',
		});
	});

	it('PUT /grades/:id обновляет марку картона и её свойства', async () => {
		const response = await request(app)
			.put('/grades/2')
			.set('Authorization', createAuthHeader())
			.send({
				name: 'Т23 updated',
				thickness: 3.6,
				crushResistance: 3.9,
			});

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			id: '2',
			name: 'Т23 updated',
		});

		const grades = await readJsonFile<CardboardGrade[]>(gradesFilePath);

		expect(grades).toContainEqual({
			id: '2',
			name: 'Т23 updated',
		});

		const gradeProperties =
			await readJsonFile<GradePropertiesMap>(gradePropertiesFilePath);

		expect(gradeProperties['2']).toEqual({
			thickness: 3.6,
			crushResistance: 3.9,
		});
	});

	it('DELETE /grades/:id удаляет марку картона и её свойства', async () => {
		const response = await request(app)
			.delete('/grades/3')
			.set('Authorization', createAuthHeader());

		expect(response.status).toBe(204);

		const grades = await readJsonFile<CardboardGrade[]>(gradesFilePath);

		expect(grades).not.toContainEqual({
			id: '3',
			name: 'Т24',
		});

		const gradeProperties =
			await readJsonFile<GradePropertiesMap>(gradePropertiesFilePath);

		expect(gradeProperties['3']).toBeUndefined();
	});
});

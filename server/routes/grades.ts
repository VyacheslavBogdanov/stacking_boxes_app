import { Router } from 'express';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { readJsonFile, writeJsonFile } from '../helpers/jsonStore';
import { authMiddleware } from '../middleware/authMiddleware';
import type {
	CardboardGrade,
	CardboardGradeWithProperties,
	GradePropertiesMap,
} from '../types';

const gradesFilePath = path.resolve(process.cwd(), 'server/data/grades.json');

const gradePropertiesFilePath = path.resolve(
	process.cwd(),
	'server/data/gradeProperties.json',
);

interface GradeRequestBody {
	name?: string;
	thickness?: number;
	crushResistance?: number;
}

interface ValidGradeRequestBody {
	name: string;
	thickness: number;
	crushResistance: number;
}

export const gradesRouter = Router();

function isValidNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value);
}

function isValidGradeBody(
	body: GradeRequestBody,
): body is ValidGradeRequestBody {
	return (
		typeof body.name === 'string' &&
		body.name.trim().length > 0 &&
		isValidNumber(body.thickness) &&
		body.thickness > 0 &&
		isValidNumber(body.crushResistance) &&
		body.crushResistance > 0
	);
}

function mergeGradesWithProperties(
	grades: CardboardGrade[],
	gradeProperties: GradePropertiesMap,
): CardboardGradeWithProperties[] {
	return grades
		.map((grade) => {
			const properties = gradeProperties[grade.id];

			if (!properties) {
				return null;
			}

			return {
				...grade,
				thickness: properties.thickness,
				crushResistance: properties.crushResistance,
			};
		})
		.filter((grade): grade is CardboardGradeWithProperties => grade !== null);
}

gradesRouter.get('/', async (_req, res, next) => {
	try {
		const grades = await readJsonFile<CardboardGrade[]>(gradesFilePath);

		res.json(grades);
	} catch (error) {
		next(error);
	}
});

gradesRouter.get('/admin', authMiddleware, async (_req, res, next) => {
	try {
		const [grades, gradeProperties] = await Promise.all([
			readJsonFile<CardboardGrade[]>(gradesFilePath),
			readJsonFile<GradePropertiesMap>(gradePropertiesFilePath),
		]);

		res.json(mergeGradesWithProperties(grades, gradeProperties));
	} catch (error) {
		next(error);
	}
});

gradesRouter.post('/', authMiddleware, async (req, res, next) => {
	try {
		const body = req.body as GradeRequestBody;

		if (!isValidGradeBody(body)) {
			res.status(400).json({
				message: 'Invalid cardboard grade data',
			});
			return;
		}

		const [grades, gradeProperties] = await Promise.all([
			readJsonFile<CardboardGrade[]>(gradesFilePath),
			readJsonFile<GradePropertiesMap>(gradePropertiesFilePath),
		]);

		const grade: CardboardGrade = {
			id: uuidv4(),
			name: body.name.trim(),
		};

		const nextGrades = [...grades, grade];

		const nextGradeProperties: GradePropertiesMap = {
			...gradeProperties,
			[grade.id]: {
				thickness: body.thickness,
				crushResistance: body.crushResistance,
			},
		};

		await Promise.all([
			writeJsonFile(gradesFilePath, nextGrades),
			writeJsonFile(gradePropertiesFilePath, nextGradeProperties),
		]);

		res.status(201).json(grade);
	} catch (error) {
		next(error);
	}
});

gradesRouter.put('/:id', authMiddleware, async (req, res, next) => {
	try {
		const { id } = req.params;
		const body = req.body as GradeRequestBody;

		if (!isValidGradeBody(body)) {
			res.status(400).json({
				message: 'Invalid cardboard grade data',
			});
			return;
		}

		const [grades, gradeProperties] = await Promise.all([
			readJsonFile<CardboardGrade[]>(gradesFilePath),
			readJsonFile<GradePropertiesMap>(gradePropertiesFilePath),
		]);

		const gradeExists = grades.some((grade) => grade.id === id);

		if (!gradeExists) {
			res.status(404).json({
				message: 'Cardboard grade not found',
			});
			return;
		}

		const updatedGrade: CardboardGrade = {
			id,
			name: body.name.trim(),
		};

		const nextGrades = grades.map((grade) =>
			grade.id === id ? updatedGrade : grade,
		);

		const nextGradeProperties: GradePropertiesMap = {
			...gradeProperties,
			[id]: {
				thickness: body.thickness,
				crushResistance: body.crushResistance,
			},
		};

		await Promise.all([
			writeJsonFile(gradesFilePath, nextGrades),
			writeJsonFile(gradePropertiesFilePath, nextGradeProperties),
		]);

		res.json(updatedGrade);
	} catch (error) {
		next(error);
	}
});

gradesRouter.delete('/:id', authMiddleware, async (req, res, next) => {
	try {
		const { id } = req.params;

		const [grades, gradeProperties] = await Promise.all([
			readJsonFile<CardboardGrade[]>(gradesFilePath),
			readJsonFile<GradePropertiesMap>(gradePropertiesFilePath),
		]);

		const gradeExists = grades.some((grade) => grade.id === id);

		if (!gradeExists) {
			res.status(404).json({
				message: 'Cardboard grade not found',
			});
			return;
		}

		const nextGrades = grades.filter((grade) => grade.id !== id);

		const nextGradeProperties: GradePropertiesMap = {
			...gradeProperties,
		};

		delete nextGradeProperties[id];

		await Promise.all([
			writeJsonFile(gradesFilePath, nextGrades),
			writeJsonFile(gradePropertiesFilePath, nextGradeProperties),
		]);

		res.status(204).send();
	} catch (error) {
		next(error);
	}
});

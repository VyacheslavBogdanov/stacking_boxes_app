import { Router } from 'express';
import path from 'node:path';
import type { BoxParams, GradePropertiesMap } from '../types';
import { readJsonFile } from '../helpers/jsonStore';
import { calculateStacking } from '../../src/utils/stackCalculation';

const gradePropertiesFilePath = path.resolve(
	process.cwd(),
	'server/data/gradeProperties.json',
);

export const calculateRouter = Router();

calculateRouter.post('/', async (req, res, next) => {
	try {
		const params = req.body as BoxParams;

		const gradeProperties =
			await readJsonFile<GradePropertiesMap>(gradePropertiesFilePath);

		const grade = gradeProperties[params.gradeId];

		if (!grade) {
			res.status(400).json({
				message: 'Unknown cardboard grade',
			});
			return;
		}

		const result = calculateStacking(params, grade);

		res.json(result);
	} catch (error) {
		next(error);
	}
});

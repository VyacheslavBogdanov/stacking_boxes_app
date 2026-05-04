import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import type { AuthPayload } from '../types';

export const authMiddleware: RequestHandler = (req, res, next) => {
	const authHeader = req.header('Authorization');

	if (!authHeader?.startsWith('Bearer ')) {
		res.status(401).json({
			message: 'Unauthorized',
		});
		return;
	}

	const token = authHeader.replace('Bearer ', '').trim();

	if (!token) {
		res.status(401).json({
			message: 'Unauthorized',
		});
		return;
	}

	if (!JWT_SECRET) {
		res.status(500).json({
			message: 'Auth config is not set',
		});
		return;
	}

	try {
		jwt.verify(token, JWT_SECRET) as AuthPayload;

		next();
	} catch {
		res.status(401).json({
			message: 'Unauthorized',
		});
	}
};

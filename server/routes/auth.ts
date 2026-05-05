import bcrypt from 'bcryptjs';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import {
	ADMIN_PASSWORD_HASH,
	ADMIN_USERNAME,
	JWT_EXPIRES_IN,
	JWT_SECRET,
} from '../config';
import type { AuthPayload, LoginRequestBody } from '../types';

export const authRouter = Router();

authRouter.post('/login', async (req, res, next) => {
	try {
		const { username, password } = req.body as Partial<LoginRequestBody>;

		if (!username || !password) {
			res.status(400).json({
				message: 'Username and password are required',
			});
			return;
		}

		if (!ADMIN_PASSWORD_HASH || !JWT_SECRET) {
			res.status(500).json({
				message: 'Auth config is not set',
			});
			return;
		}

		const isUsernameValid = username === ADMIN_USERNAME;
		const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

		if (!isUsernameValid || !isPasswordValid) {
			res.status(401).json({
				message: 'Invalid credentials',
			});
			return;
		}

		const payload: AuthPayload = {
			sub: username,
		};

		const token = jwt.sign(payload, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_IN,
		});

		res.json({
			token,
		});
	} catch (error) {
		next(error);
	}
});

authRouter.post('/logout', (_req, res) => {
	res.status(204).send();
});

import dotenv from 'dotenv';

dotenv.config();

export const PORT = Number(process.env.PORT ?? 5011);

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';

export const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH ?? '';

export const JWT_SECRET = process.env.JWT_SECRET ?? '';

export const JWT_EXPIRES_IN = '8h';

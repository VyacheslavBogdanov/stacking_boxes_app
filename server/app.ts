import cors from 'cors';
import express from 'express';
import { gradesRouter } from './routes/grades';
import { calculateRouter } from './routes/calculate';
import { authRouter } from './routes/auth';

export const app = express();

app.use(cors());
app.use(express.json());
app.use('/grades', gradesRouter);
app.use('/calculate', calculateRouter);
app.use(authRouter);
app.get('/health', (_req, res) => {
	res.json({
		status: 'ok',
	});
});

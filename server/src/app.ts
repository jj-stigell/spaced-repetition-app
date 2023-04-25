// Modules
import cors from 'cors';
import express, { Application, Request, Response } from 'express';

// Project imports
import { FRONTEND_ORIGIN } from './configs/environment';
import errorMiddleware from './middleware/errorMiddleware';
import loggerMiddleware from './middleware/loggerMiddleware';
import { router } from './routes/index';

export const app: Application = express();

app.use(express.json());
app.use(loggerMiddleware);

app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));

app.use('/api/v1/', router);
app.use(errorMiddleware);

// Health check endpoint.
app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).send();
});

// 404
app.get('*', (_req: Request, res: Response): void => {
  res.status(404).send();
});

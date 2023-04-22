// Modules
import express, { Application } from 'express';

// Project imports
import errorMiddleware from './middleware/errorMiddleware';
import loggerMiddleware from './middleware/loggerMiddleware';
import { router } from './routes/index';

export const app: Application = express();

app.use(express.json());
app.use(loggerMiddleware);
app.use('/api/v1/', router);
app.use(errorMiddleware);

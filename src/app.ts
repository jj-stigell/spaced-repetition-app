import express from 'express';
import cors from 'cors';
import healthCheckRouter from './controllers/healthCheckRouter';

const app = express();

app.use(cors());
//app.use(express.static('build'));
app.use(express.json());
app.use('/api/health', healthCheckRouter);
//app.use(errorHandler);

export default app;

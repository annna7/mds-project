import express, { Express } from 'express';
import corsMiddleware from './middleware/cors';
import loggerMiddleware from './middleware/logger';
import { config } from './configure';
import { userRouter, reviewRouter, listingRouter, searchRouter } from './routes';

const app: Express = express();

app.set('port', config.port);

app.use(express.json());
app.use(loggerMiddleware);
app.use(corsMiddleware);

app.get('/api', (req, res) => {
	res.send('Hello World!');
});

app.use('/api/users', userRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/listings', listingRouter);
app.use('/api/search', searchRouter);

export default app;
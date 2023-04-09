import express from 'express';
// tslint:disable-next-line
import { logger } from './core/logger';
import { errorHandler } from './middleware/postErrorHandler';
import addCorrelationIdMiddleWare from './middleware/addCorrelationId';
import { defaultAxios } from './core/defaultAxios';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(correlationIdMiddleware);
app.disable('x-powered-by');

app.use(addCorrelationIdMiddleWare);

// GET route to receive all connected clients for a user
app.get('/endpoint', async (req: express.Request, res: express.Response) => {
  logger.info('received request on endpoint');
  res.status(200).json(req.body);
});

app.get(
  '/other-endpoint',
  async (req: express.Request, res: express.Response) => {
    logger.info('received request on other-endpoint');
    await defaultAxios.get('http://localhost:3000/endpoint', {
      data: req.body,
    });
    res.status(200).json(req.body);
  }
);

app.use(errorHandler);
// start the Express server
const port = Number.parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  logger.info(`Server started at http://0.0.0.0:${port} 🚀`);
});

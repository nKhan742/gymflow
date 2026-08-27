import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { appConfig } from './config/app.config.js';
import { apiRouter } from './routes/api.router.js';
import { errorHandlerMiddleware } from './core/middleware/errorHandler.middleware.js';

export function createApp(): Express {
  const app = express();

  // Security & Middleware
  app.use(helmet());
  app.use(cors({ origin: appConfig.corsOrigin, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(morgan(appConfig.env === 'production' ? 'combined' : 'dev'));

  // Static files
  app.use('/static', express.static('uploads'));

  // Mount Central API Routes
  app.use(appConfig.apiPrefix, apiRouter);

  // Global Error Handler
  app.use(errorHandlerMiddleware);

  return app;
}

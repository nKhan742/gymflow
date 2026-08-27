import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/HttpException.js';
import { BaseResponse } from '../../shared/base/BaseResponse.js';
import { logger } from '../logger/winston.logger.js';

export const errorHandlerMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json(BaseResponse.error(err.message, err.errors));
  }

  logger.error('[UnhandledException]', { message: err.message, stack: err.stack });

  return res.status(500).json(BaseResponse.error('Internal server error'));
};

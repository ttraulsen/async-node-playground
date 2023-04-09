import { NextFunction, Response, Request } from 'express';
import { randomUUID } from 'crypto';
import { logger } from '../core/logger';
import { AsyncLocalStorage } from 'async_hooks';

//const log = createLogger();

export const asyncLocalStorage = new AsyncLocalStorage<string>();

/**
 * Middleware to identify and set correlationIds for requests
 * @module
 */
export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const correlationId = getOrCreateCorrelationId(req);
  logger.info(`CorrelationId: ${correlationId}`);
  // Write correlationId normalized to request object, so it can be easily read from there in other places
  req.headers['x-correlation-id'] = correlationId;

  // Sent correlationId back in response headers
  res.set('x-correlation-id', correlationId);
  asyncLocalStorage.enterWith(correlationId);
  next();
};

const getOrCreateCorrelationId = (req: Request): string => {
  const correlationId =
    req.get('x-correlation-id') ||
    req.get('x-request-id') ||
    req.query.correlationId;
  //if (!correlationId) log.debug('no correlation id found in request');
  if (
    typeof correlationId === 'string' &&
    correlationId.length >= 16 &&
    correlationId.length <= 100
  )
    return correlationId;

  return randomUUID();
};

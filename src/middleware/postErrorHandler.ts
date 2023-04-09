import { Request, Response, NextFunction } from 'express';
import { logger } from '../core/logger';



export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (err) {
    logger.error(err);
  }

  return res.status(500).json({ error: 'Something went wrong' });
};

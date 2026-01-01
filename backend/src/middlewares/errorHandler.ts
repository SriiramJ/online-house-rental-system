import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.ts';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', err);
  
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format in request body'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};
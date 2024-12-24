import { NextFunction, Request, Response } from 'express';

const globalErrorhandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went Wrong!';

  res.status(statusCode).json({
    success: false,
    message: message,
    error: err,
  });
};

export default globalErrorhandler;

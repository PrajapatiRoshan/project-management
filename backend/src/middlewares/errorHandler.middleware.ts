import { ErrorRequestHandler, Response } from 'express';
import { HTTPSTATUS } from '../config/http.config';
import { AppError } from '../utils/appError';
import { ZodError } from 'zod';
import { ErrorCodeEnum } from '../enums/error-code.enum';

const formatZodError = (res: Response, error: ZodError) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: 'Validation failed',
    errors: errors,
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
  });
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next): any => {
  console.error(`Error occured onPATH : ${req.path}`, error);

  if (error instanceof SyntaxError) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: 'Invalid JSON format. Please check you request body.',
    });
  }

  if (error instanceof ZodError) {
    return formatZodError(res, error);
  }
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: 'Internal server error',
    error: error?.message || 'Unkown error occured',
  });
};


import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '../utils/appError';

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  // if (!req.user || !req.user._id) {
  //   throw new UnauthorizedException('Unauthorized. Please log in.');
  // }
  // next();
  try {
    if (!req.user || !req.user._id) {
      throw new UnauthorizedException('Unauthorized. Please log in.');
    }
    next();
  } catch (error) {
    next(error); // Pass any unexpected errors to the error handler
  }
};

export default isAuthenticated;


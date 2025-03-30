import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '../utils/appError';
import { HTTPSTATUS } from '../config/http.config';

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
  // if (!req.user || !req.user._id) {
  //   return res
  //     .status(HTTPSTATUS.UNAUTHORIZED)
  //     .json({ message: 'Unauthorized. Please log in.' });
  // }
  // next();
};

export default isAuthenticated;


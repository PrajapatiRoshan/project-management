import { Router } from 'express';
import passport from 'passport';
import { config } from '../config/app.config';
import { googleLoginCallback } from '../controllers/auth.controller';

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;
const authRoutes = Router();

authRoutes.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);

authRoutes.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: failedUrl,
  }),
  googleLoginCallback
);

export default authRoutes;

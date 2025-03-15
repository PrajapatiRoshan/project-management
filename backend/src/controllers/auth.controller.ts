import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.middleware';
import { config } from '../config/app.config';

export const googleLoginCallback = asyncHandler(async (req: Request, res: Response) => {
  const currentWorkspace = req.user?.currentWorkspace;

  if (!currentWorkspace) {
    return res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`);
  }

  // return res.redirect(`${config.FRONTEND_ORIGIN}/workspaces/${currentWorkspace}`);
  // Append the redirect_uri in the callback URL
  const redirectUri = encodeURIComponent(config.FRONTEND_GOOGLE_CALLBACK_URL);
  return res.redirect(
    `${config.FRONTEND_ORIGIN}/workspaces/${currentWorkspace}?redirect_uri=${redirectUri}`
  );
});

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {}
);


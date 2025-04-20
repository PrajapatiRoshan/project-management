// Importing necessary types and modules
import { NextFunction, Request, Response } from 'express'; // Types from Express
import { asyncHandler } from '../middlewares/asyncHandler.middleware'; // Custom middleware to handle async errors
import { config } from '../config/app.config'; // Configuration file with environment variables
import { registerSchema } from '../validation/auth.validation'; // Schema for registration validation
import { HTTPSTATUS } from '../config/http.config'; // HTTP status codes
import { registerUserService } from '../services/auth.service'; // Service to handle user registration
import passport from 'passport'; // Passport.js for authentication
import { signJwtToken } from '../utils/jwt';

// Google login callback controller
export const googleLoginCallback = asyncHandler(async (req: Request, res: Response) => {
  const jwt = req.jwt;
  const currentWorkspace = req.user?.currentWorkspace;

  if (!jwt) {
    return res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`);
  }

  return res.redirect(
    `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=success&access_token=${jwt}&current_workspace=${currentWorkspace}`
  );

  // // Retrieve the current workspace from the authenticated user
  // const currentWorkspace = req.user?.currentWorkspace;

  // // If the workspace is not available, redirect to the callback URL with a failure status
  // if (!currentWorkspace) {
  //   return res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`);
  // }

  // // Construct the redirect URI by encoding it for use in the URL
  // const redirectUri = encodeURIComponent(config.FRONTEND_GOOGLE_CALLBACK_URL);

  // // Redirect the user to the workspace URL with the redirect_uri appended as a query parameter
  // return res.redirect(
  //   `${config.FRONTEND_ORIGIN}/workspaces/${currentWorkspace}?redirect_uri=${redirectUri}`
  // );
});

// User registration controller
export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    // Validate the request body using the registration schema
    const body = registerSchema.parse({ ...req.body });

    // Call the registration service to create a new user
    await registerUserService(body);

    // Send a success response with status 201 (Created)
    return res.status(HTTPSTATUS.CREATED).json({
      message: 'User registered successfully',
    });
  }
);

// User login controller
export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Authenticate the user using the local strategy configured with Passport
    passport.authenticate(
      'local',
      (
        err: Error | null, // Error object, if any
        user: Express.User | false, // Authenticated user object or false if not authenticated
        info: { message: string } | undefined // Additional information, if available
      ) => {
        // Handle any errors that occurred during authentication
        if (err) {
          return next(err); // Pass the error to the next middleware
        }

        // If no user is found, return a 401 (Unauthorized) response
        if (!user) {
          return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            message: info?.message || 'Invalid email and password',
          });
        }

        // Log the user into the session
        // req.logIn(user, (err) => {
        //   if (err) {
        //     return next(err); // Handle login errors
        //   }

        //   // Send a success response with the logged-in user information
        //   return res.status(HTTPSTATUS.OK).json({
        //     message: 'Logged in successfully',
        //     user,
        //   });
        // });

        const access_token = signJwtToken({ userId: user._id });

        return res.status(HTTPSTATUS.OK).json({
          message: 'Logged in successfully',
          access_token,
          user,
        });
      }
    )(req, res, next); // Immediately call the authentication function with request, response, and next
  }
);

// User logout controller
export const logOutController = asyncHandler(async (req: Request, res: Response) => {
  // Log the user out and handle any errors during the process
  req.logout((err) => {
    if (err) {
      console.error('Logout error: ', err); // Log the error to the console
      return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Logout failed',
        error: 'Failed to logout',
      });
    }
  });

  // Clear the session data to fully log out the user
  req.session = null;

  // Send a success response confirming logout
  return res.status(HTTPSTATUS.OK).json({
    message: 'Logged out successfully',
  });
});

/*
  Google Login Callback:

  Redirects the user to the appropriate workspace after successful authentication.
  Uses encodeURIComponent to properly format the redirect URI.
  User Registration Controller:

  Uses the registration schema to validate the incoming request data.
  Calls a service to register the user and sends a success response.
  User Login Controller:

  Uses Passport's local authentication strategy.
  Handles errors, failed login attempts, and successful login scenarios.
  Uses req.logIn() to establish the session after successful authentication.
  User Logout Controller:

  Uses req.logout() to terminate the session.
  Handles errors during logout and clears the session.
  Sends a response indicating successful logout.
*/


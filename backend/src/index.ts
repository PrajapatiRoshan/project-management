// Import environment variables from .env file
import 'dotenv/config';
// Import express and related types for building the server
import express, { NextFunction, Request, Response } from 'express';
// Import CORS middleware for handling cross-origin requests
import cors from 'cors';
// Import session middleware for managing user sessions
import session from 'cookie-session';
// Import application configuration
import { config } from './config/app.config';
// Import database connection function
import connectDatabase from './config/database.config';
// Import custom error handler middleware
import { errorHandler } from './middlewares/errorHandler.middleware';
// Import HTTP status codes
import { HTTPSTATUS } from './config/http.config';
// Import async handler middleware for handling async errors
import { asyncHandler } from './middlewares/asyncHandler.middleware';
// Import Passport.js configuration for authentication
import './config/passport.config';
// Import Passport.js for authentication
import passport from 'passport';
// Import custom error class for handling application-specific errors
import { BadRequestException } from './utils/appError';
// Import error code enumeration
import { ErrorCodeEnum } from './enums/error-code.enum';
// Import authentication routes
import authRoutes from './routes/auth.route';
// Import user-related routes
import userRoutes from './routes/user.routes';
// Import middleware to check if the user is authenticated
import isAuthenticated from './middlewares/isAuthenticated.middleware';
// Import workspace-related routes
import workspaceRoutes from './routes/workspace.route';
// Import member-related routes
import memberRoutes from './routes/member.routes';
// Import project-related routes
import projectRoutes from './routes/project.routes';
// Import task-related routes
import taskRoutes from './routes/task.route';
import { passportAuthenticationJWT } from './config/passport.config';

// Initialize the Express application
const app = express();
// Define the base path for API routes
const BASE_PATH = config.BASE_PATH;

// Middleware to parse incoming JSON requests
app.use(express.json());
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
// Middleware to configure session management
// app.use( <--
//   session({
//     name: 'session', // Name of the session cookie
//     keys: [config.SESSION_SECRET], // Secret key for encrypting the session
//     maxAge: 24 * 60 * 60 * 1000, // Session expiration time (24 hours)
//     secure: config.NODE_ENV === 'production', // Use secure cookies in production
//     httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
//     sameSite: 'lax', // Restrict cross-site cookie usage
//   })
// );

// Initialize Passport.js for authentication
app.use(passport.initialize());
// Enable persistent login sessions with Passport.js
// app.use(passport.session()); <--

// Enable CORS with specific configuration
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN, // Allow requests from the frontend origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

// Define a test route for the root path
app.get(
  '/',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.send('working...');
    // Throw a custom bad request error
    throw new BadRequestException(
      'This is a bad request',
      ErrorCodeEnum.AUTH_INVALID_TOKEN
    );
    // Send a success response (this line is unreachable due to the error above)
    return res.status(HTTPSTATUS.OK).json({ message: 'Backend Running' });
  })
);

//passport session
// Mount authentication routes at /auth
// app.use(`${BASE_PATH}/auth`, authRoutes);
// // Mount user-related routes at /user, protected by authentication middleware
// app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
// // Mount workspace-related routes at /workspace, protected by authentication middleware
// app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
// // Mount member-related routes at /member, protected by authentication middleware
// app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
// // Mount project-related routes at /project, protected by authentication middleware
// app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
// // Mount task-related routes at /task, protected by authentication middleware
// app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);

//JWT session
// Mount authentication routes at /auth
app.use(`${BASE_PATH}/auth`, authRoutes);
// Mount user-related routes at /user, protected by authentication middleware
app.use(`${BASE_PATH}/user`, passportAuthenticationJWT, userRoutes);
// Mount workspace-related routes at /workspace, protected by authentication middleware
app.use(`${BASE_PATH}/workspace`, passportAuthenticationJWT, workspaceRoutes);
// Mount member-related routes at /member, protected by authentication middleware
app.use(`${BASE_PATH}/member`, passportAuthenticationJWT, memberRoutes);
// Mount project-related routes at /project, protected by authentication middleware
app.use(`${BASE_PATH}/project`, passportAuthenticationJWT, projectRoutes);
// Mount task-related routes at /task, protected by authentication middleware
app.use(`${BASE_PATH}/task`, passportAuthenticationJWT, taskRoutes);

// Use the custom error handler middleware for handling errors
app.use(errorHandler);

// Start the server and connect to the database
app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV} mode`);
  await connectDatabase(); // Connect to the database
});


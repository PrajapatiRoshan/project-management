// Import the getEnv utility function from the utils directory
import { getEnv } from '../utils/get-env';

// Define the appConfig function which returns an object containing configuration values
const appConfig = () => ({
  // Get the NODE_ENV environment variable, default to 'development' if not set
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  // Get the PORT environment variable, default to '5000' if not set
  PORT: getEnv('PORT', '5000'),
  // Get the BASE_PATH environment variable, default to '/api' if not set
  BASE_PATH: getEnv('BASE_PATH', '/api'),
  // Get the MONGO_URI environment variable, default to an empty string if not set
  MONGO_URI: getEnv('MONGO_URI', ''),

  // Get the SESSION_SECRET environment variable
  JWT_SECRET: getEnv('JWT_SECRET'),
  // Get the JWT_EXPIRES_IN environment variable
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '1d'),

  // Get the SESSION_SECRET environment variable
  SESSION_SECRET: getEnv('SESSION_SECRET'),
  // Get the SESSION_EXPIRES_IN environment variable
  SESSION_EXPIRES_IN: getEnv('SESSION_EXPIRES_IN'),

  // Get the GOOGLE_CLIENT_ID environment variable
  GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID'),
  // Get the GOOGLE_CLIENT_SECRET environment variable
  GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET'),
  // Get the GOOGLE_CALLBACK_URL environment variable
  GOOGLE_CALLBACK_URL: getEnv('GOOGLE_CALLBACK_URL'),

  // Get the FRONTEND_ORIGIN environment variable, default to 'localhost' if not set
  FRONTEND_ORIGIN: getEnv('FRONTEND_ORIGIN', 'localhost'),
  // Get the FRONTEND_GOOGLE_CALLBACK_URL environment variable
  FRONTEND_GOOGLE_CALLBACK_URL: getEnv('FRONTEND_GOOGLE_CALLBACK_URL'),
});

// Export the configuration object by calling the appConfig function
export const config = appConfig();


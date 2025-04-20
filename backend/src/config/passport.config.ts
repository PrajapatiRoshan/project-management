// Importing necessary modules and strategies for authentication
import passport from 'passport'; // Passport.js for authentication
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'; // Google OAuth 2.0 strategy
import { Strategy as LocalStrategy } from 'passport-local'; // Local authentication strategy
import { config } from './app.config'; // Configuration file for environment variables
import { Request } from 'express'; // Express Request object type
import { NotFoundException } from '../utils/appError'; // Custom exception handling
import { ProviderEnum } from '../enums/account-provider.enum'; // Enum for different account providers
import {
  findUserById,
  loginOrCreateAccountService,
  verifyUserService,
} from '../services/auth.service'; // Authentication services
import { signJwtToken } from '../utils/jwt';
import { StrategyOptions, ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

// Setting up Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID, // Google client ID from environment variables
      clientSecret: config.GOOGLE_CLIENT_SECRET, // Google client secret from environment variables
      callbackURL: config.GOOGLE_CALLBACK_URL, // Callback URL after successful authentication
      scope: ['profile', 'email'], // Google scopes to request profile and email data
      passReqToCallback: true, // Pass the Express request object to the callback
    },
    async (req: Request, accessToken, refreshToken, profile, done) => {
      try {
        // Extract user information from the profile object returned by Google
        const { email, sub: googleId, picture } = profile._json;
        console.log(profile, 'profile'); // Debug: Log the full profile object
        console.log(googleId, 'googleId'); // Debug: Log the Google ID

        // Handle missing Google ID case
        if (!googleId) {
          throw new NotFoundException('Google ID (sub) is missing'); // Throw custom exception
        }

        // Call a service to either log in or create a new account using Google credentials
        const { user } = await loginOrCreateAccountService({
          provider: ProviderEnum.GOOGLE, // Specify Google as the provider
          displayName: profile.displayName, // User's display name
          providerId: googleId, // Unique Google ID
          picture: picture, // User's profile picture
          email: email, // User's email address
        });

        const jwt = signJwtToken({ userId: user._id });

        req.jwt = jwt;

        // Indicate successful authentication by passing the user object
        done(null, user);
      } catch (error) {
        // Handle any errors during the process
        done(error, false);
      }
    }
  )
);

// Setting up Local authentication strategy (username and password)
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // Specifies that the username field in the request will be 'email'
      passwordField: 'password', // Specifies that the password field in the request will be 'password'
      session: false, // Enables persistent login sessions
    },
    async (email, password, done) => {
      try {
        // Verify the user with the given email and password using a service
        const user = await verifyUserService({ email, password });
        // If successful, pass the user object to the next middleware
        return done(null, user);
      } catch (error: any) {
        // If authentication fails, pass the error and false to indicate failure
        return done(error, false, { message: error?.message });
      }
    }
  )
);

interface JwtPayload {
  userId: string;
}

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
  audience: ['user'],
  algorithms: ['HS256'],
};

passport.use(
  new JwtStrategy(options, async (payload: JwtPayload, done) => {
    try {
      const user = await findUserById(payload.userId);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(null, false);
    }
  })
);

// Serialize the user object into the session
passport.serializeUser((user: any, done) => done(null, user));

// Deserialize the user object from the session
passport.deserializeUser((user: any, done) => done(null, user));

export const passportAuthenticationJWT = passport.authenticate('jwt', { session: false });
// export const passportAuthenticationGoogle = passport.authenticate('google', {
//   scope: ['profile', 'email'],
//   session: false,
// });

// export const passportAuthenticationLocal = passport.authenticate('local', { session: false });


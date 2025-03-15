import { z } from 'zod'; // Import the zod library for schema validation

export const emailSchema = z // Define a schema for the email field
  .string() // The email should be a string
  .trim() // Remove leading and trailing whitespace
  .email('Invalid email address') // Validate the email format with a custom error message
  .min(1) // Minimum length of 1 character
  .max(255); // Maximum length of 255 characters

export const passwordSchema = z.string().trim().min(4).max(255); // Define a schema for the password field

export const registerSchema = z.object({
  // Define a schema for registering a user
  name: z.string().trim().min(1).max(255), // The name field should be a string with a minimum length of 1 and a maximum length of 255
  email: emailSchema, // The email field should follow the emailSchema
  password: passwordSchema, // The password field should follow the passwordSchema
});

export const loginSchema = z.object({
  // Define a schema for logging in a user
  email: emailSchema, // The email field should follow the emailSchema
  password: passwordSchema, // The password field should follow the passwordSchema
});


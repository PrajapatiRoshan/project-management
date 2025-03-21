// Importing the Zod library for schema validation
import { z } from 'zod';

// Schema for an optional emoji field, which is a trimmed string
export const emojiSchema = z.string().trim().optional();

// Schema for a required name field, which is a trimmed string with a length between 1 and 255 characters
export const nameSchema = z.string().trim().min(1).max(255);

// Schema for an optional description field, which is a trimmed string
export const descriptionSchema = z.string().trim().optional();

// Schema for a required project ID field, which is a trimmed string with a minimum length of 1
export const projectIdSchema = z.string().trim().min(1);

// Schema for creating a project, which includes optional emoji, required name, and optional description fields
export const createProjectSchema = z.object({
  emoji: emojiSchema, // Emoji field validation
  name: nameSchema, // Name field validation
  description: descriptionSchema, // Description field validation
});

// Schema for updating a project, which includes optional emoji, name, and description fields
export const updatedProjectSchema = z.object({
  emoji: emojiSchema, // Emoji field validation
  name: nameSchema, // Name field validation
  description: descriptionSchema, // Description field validation
});


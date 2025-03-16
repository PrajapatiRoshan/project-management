import { z } from 'zod'; // Import the zod library for schema validation

export const nameSchmea = z // Define a schema for the name field
  .string() // The name should be a string
  .trim() // Remove leading and trailing whitespace
  .min(1, { message: 'Name is required' }) // Minimum length of 1 character with a custom error message
  .max(255); // Maximum length of 255 characters

export const descriptionSchema = z.string().trim().optional(); // Define a schema for the description field, which is optional

export const workspaceIdSchema = z.string().trim().min(1, {
  // Define a schema for the workspace ID field
  message: 'Workspace ID is required', // Custom error message for minimum length
});

export const changeRoleSchema = z.object({
  roleId: z.string().trim().min(1),
  memberId: z.string().trim().min(1),
});

export const createWorkSpaceSchema = z.object({
  // Define a schema for creating a workspace
  name: nameSchmea, // The name field should follow the nameSchmea
  description: descriptionSchema, // The description field should follow the descriptionSchema
});

export const updateWorkSpaceSchema = z.object({
  // Define a schema for updating a workspace
  name: nameSchmea, // The name field should follow the nameSchmea
  description: descriptionSchema, // The description field should follow the descriptionSchema
});


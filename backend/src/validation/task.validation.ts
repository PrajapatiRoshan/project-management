// Importing required modules and enums
import { title } from 'process'; // Unused import, can be removed
import { string, z } from 'zod'; // Importing Zod for schema validation
import { TaskPriorityEnum, TaskStatusEnum } from '../enums/task.enum'; // Importing enums for task priority and status

// Schema for validating the title of a task (required, trimmed, 1-255 characters)
export const titleSchema = z.string().trim().min(1).max(255);

// Schema for validating the description of a task (optional, trimmed)
export const descriptionSchema = z.string().trim().optional();

// Schema for validating the priority of a task (must match TaskPriorityEnum values)
export const prioritySchema = z.enum(
  Object.values(TaskPriorityEnum) as [string, ...string[]]
);

// Schema for validating the status of a task (must match TaskStatusEnum values)
export const statusSchema = z.enum(
  Object.values(TaskStatusEnum) as [string, ...string[]]
);

// Schema for validating the assignedTo field (optional, nullable, trimmed, minimum 1 character if provided)
export const assignedToSchema = z.string().trim().min(1).nullable().optional();

// Schema for validating the due date of a task (optional, must be a valid date string if provided)
export const dueDateSchema = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || !isNaN(Date.parse(value)), {
    message: 'Invalid date. please provide valide details', // Custom error message for invalid date
  });

// Schema for validating the task ID (required, trimmed, minimum 1 character)
export const taskIdSchema = z.string().trim().min(1);

// Schema for validating the creation of a task (includes all required fields for task creation)
export const createTaskSchema = z.object({
  title: titleSchema, // Title is required
  description: descriptionSchema, // Description is optional
  priority: prioritySchema, // Priority is required
  status: statusSchema, // Status is required
  assignedTo: assignedToSchema, // AssignedTo is optional
  dueDate: dueDateSchema, // DueDate is optional
});

// Schema for validating the update of a task (similar to createTaskSchema, all fields are optional for updates)
export const updateTaskSchema = z.object({
  title: titleSchema, // Title is optional
  description: descriptionSchema, // Description is optional
  priority: prioritySchema, // Priority is optional
  status: statusSchema, // Status is optional
  assignedTo: assignedToSchema, // AssignedTo is optional
  dueDate: dueDateSchema, // DueDate is optional
});


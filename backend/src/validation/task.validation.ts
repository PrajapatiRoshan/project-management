import { title } from 'process';
import { string, z } from 'zod';
import { TaskPriorityEnum, TaskStatusEnum } from '../enums/task.enum';

export const titleSchema = z.string().trim().min(1).max(255);
export const descriptionSchema = z.string().trim().optional();

export const prioritySchema = z.enum(
  Object.values(TaskPriorityEnum) as [string, ...string[]]
);

export const statusSchema = z.enum(
  Object.values(TaskStatusEnum) as [string, ...string[]]
);

export const assignedToSchema = z.string().trim().min(1).nullable().optional();

export const dueDateSchema = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || !isNaN(Date.parse(value)), {
    message: 'Invalid date. please provide valide details',
  });

export const taskIdSchema = z.string().trim().min(1);

export const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  status: statusSchema,
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,
});

export const updateTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  status: statusSchema,
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,
});


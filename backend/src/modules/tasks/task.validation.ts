import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(150),

  description: z.string().optional(),

  status: z.enum([
    "TODO",
    "IN_PROGRESS",
    "COMPLETED"
  ]).optional(),

  priority: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH"
  ]).optional()
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required"
  );

export const taskQuerySchema = z.object({
  status: z.enum([
    "TODO",
    "IN_PROGRESS",
    "COMPLETED"
  ]).optional(),

  priority: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH"
  ]).optional(),

  search: z.string().optional(),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10)
});

export type CreateTaskDTO = z.infer<
  typeof createTaskSchema
>;

export type UpdateTaskDTO = z.infer<
  typeof updateTaskSchema
>;

export type TaskQueryDTO = z.infer<
  typeof taskQuerySchema
>;
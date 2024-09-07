import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
});

export const CreateTaskSchema = TaskSchema.omit({ id: true, status: true });
export const UpdateTaskSchema = TaskSchema.partial().omit({ id: true });

export type Task = z.infer<typeof TaskSchema>;

import { z } from "zod";
import type { Todo } from "./todo.types";

export const todoSchema = z
  .object({
    id: z.string().optional(),
    title: z
      .string()
      .min(3, { message: "Todo should have a min length of 3 characters." })
      .max(20, { message: "Todo should have a max length of 20 characters." }),
    completed: z.boolean().optional(),
  })
  .transform(({ id, title, completed }) => ({
    id: id || crypto.randomUUID(),
    title,
    completed: completed || false,
  }));

export function todo({
  id,
  title,
  completed,
}: Todo): z.output<typeof todoSchema> {
  const todo = todoSchema.parse({
    id,
    title,
    completed,
  });

  return todo;
}

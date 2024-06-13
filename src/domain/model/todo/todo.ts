import { z } from "zod";
import type { Todo } from "./todo.types";

export const todoSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(3, { message: "Todo should have a min length of 3 characters." })
    .max(20, { message: "Todo should have a max length of 20 characters." }),
  completed: z.boolean().optional(),
});

export function todo({
  id = crypto.randomUUID(),
  title,
  completed = false,
}: Todo): Todo {
  const todo = todoSchema.parse({
    id,
    title,
    completed,
  });
  return todo;
}

import { z } from "zod";
import { todoSchema } from "./todo";

export type Todo = z.input<typeof todoSchema>;

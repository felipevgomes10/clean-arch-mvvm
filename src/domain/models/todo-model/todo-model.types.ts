import { z } from "zod";
import { todoSchema } from "./todo-model";

export type TodoModel = z.input<typeof todoSchema>;

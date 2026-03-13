import { z } from "zod"

export type ZodTableProps<T> = {
  schema: z.ZodType<T>;
  data: T[];
  renderers?: Partial<{
    [K in keyof T]: (value: T[K]) => unknown;
  }>;
}
import { z } from "zod";

export const ApiStatusDTO = z.object({
  message: z.string(),
  version: z.string(),
  url: z.string(),
}).strict();

export type ApiStatusDTO = z.infer<typeof ApiStatusDTO>;

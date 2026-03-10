import { z } from 'zod';
import { IntervalEnum } from './enums.js';

export const AutomaticTopupDTO = z
  .object({
    id: z.number(),
    userId: z.number(),
    amount: z.number(),
    interval: z.enum(IntervalEnum.options),
    lastRun: z.string().nullable().default(null), // ISO representation
  })
  .strict();

export const CreateAutomaticTopupDTO = AutomaticTopupDTO.pick({
  userId: true,
  amount: true,
  interval: true,
}).strict();

export const UpdateAutomaticTopupDTO = AutomaticTopupDTO.pick({
  amount: true,
  interval: true,
})
  .partial()
  .strict();

export type AutomaticTopupDTO = z.infer<typeof AutomaticTopupDTO>;
export type CreateAutomaticTopupDTO = z.infer<typeof CreateAutomaticTopupDTO>;
export type UpdateAutomaticTopupDTO = z.infer<typeof UpdateAutomaticTopupDTO>;
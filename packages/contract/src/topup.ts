import { z } from "zod";

export const TopupDTO = z
  .object({
    id: z.number(),
    adminId: z.number(),
    userId: z.number(),

    amount: z.number(),
    oldSaldo: z.number(),
    newSaldo: z.number(),

    date: z.string(), // ISO representation
    checked: z.boolean().default(false),
  })
  .strict();

export const CreateTopupDTO = TopupDTO.pick({
  adminId: true,
  userId: true,

  amount: true,
  oldSaldo: true,
  newSaldo: true,
}).strict();

// No update DTO, it can be undone, but not updated

export type TopupDTO = z.infer<typeof TopupDTO>;
export type CreateTopupDTO = z.infer<typeof CreateTopupDTO>;

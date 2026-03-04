import { z } from "zod";

export const UserDTO = z
  .object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    phonenumber: z.string(),
    lastorder: z.string().nullable().default(null), // ISO representation

    saldo: z.number().default(0),
    saldoReminders: z.number().default(0),

    exemptForReminders: z.boolean().default(false),
    exemptForFines: z.boolean().default(false),

    archived: z.boolean().default(false),
  })
  .strict();

export const CreateUserDTO = UserDTO.pick({
  email: true,
  phonenumber: true,
  name: true,
}).strict();

export const UpdateUserDTO = UserDTO.pick({
  email: true,
  phonenumber: true,
  name: true,
  saldo: true,
  exemptForReminders: true,
  exemptForFines: true,
})
  .partial()
  .strict();

export type UserDTO = z.infer<typeof UserDTO>;
export type CreateUserDTO = z.infer<typeof CreateUserDTO>;
export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;

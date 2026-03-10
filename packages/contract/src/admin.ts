import { z } from 'zod';

export const AdminDTO = z
  .object({
    id: z.number(),
    username: z.string().min(1, 'Username is verplicht'),
    displayname: z.string().min(1, 'Displayname is verplicht'),
    archived: z.boolean().default(false),
  })
  .strict();

export const CreateAdminDTO = AdminDTO.pick({
  username: true,
  displayname: true,
})
  .extend({
    password: z.string().min(1, 'Wachtwoord is verplicht'),
  })
  .strict();

export const UpdateAdminDTO = AdminDTO.pick({
  username: true,
  displayname: true,
})
  .strict()
  .partial();

export type AdminDTO = z.infer<typeof AdminDTO>;
export type CreateAdminDTO = z.infer<typeof CreateAdminDTO>;
export type UpdateAdminDTO = z.infer<typeof UpdateAdminDTO>;
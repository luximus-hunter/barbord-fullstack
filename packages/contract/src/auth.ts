import { z } from "zod";
import { AdminDTO, CreateAdminDTO } from "./admin";

export const LoginDTO = CreateAdminDTO.pick({
  username: true,
  password: true,
}).strict();

export const AuthUserDTO = AdminDTO.pick({
  id: true,
  username: true,
  displayname: true,
})
  .extend({
    token: z.string().optional(),
  })
  .strict();

export type LoginDTO = z.infer<typeof LoginDTO>;
export type AuthUserDTO = z.infer<typeof AuthUserDTO>;

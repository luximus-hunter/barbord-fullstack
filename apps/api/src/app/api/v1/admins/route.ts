"use server";

import { db } from "@repo/db";
import { AdminDTO, CreateAdminDTO } from "@repo/contract";
import { ZodErrorResponse } from "@/lib/responses";
import { TypedResponse } from "@/lib/helpers";
import { authenticated } from "@/lib/auth/authenticated";
import { toAdminDTO } from "@/mappers/admin.mapper";
import { hashPassword } from "@/lib/auth/password";

// NOTE: This GET endpoint is intentionally left unauthenticated.
// This is for the admin selection on the login page.
export const GET = async () => {
  const admins = await db.admin.findMany({
    where: { archived: false },
  });

  return TypedResponse.json<AdminDTO[]>(admins.map(toAdminDTO));
};

export const POST = authenticated(async (request) => {
  const body = await request.json();
  const result = CreateAdminDTO.safeParse(body);

  if (!result.success) return ZodErrorResponse(result);

  const hash = await hashPassword(result.data.password);

  const admin = await db.admin.create({
    data: {
      username: result.data.username,
      displayname: result.data.displayname,
      password: hash,
    },
  });

  return TypedResponse.json<AdminDTO>(toAdminDTO(admin));
});

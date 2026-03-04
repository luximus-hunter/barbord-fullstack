"use server";

"use server";

import { db } from "@repo/db";
import { toAdminDTO } from "@/mappers/admin.mapper";
import { AdminDTO } from "@repo/contract";
import { TypedResponse } from "@/lib/helpers";
import { authenticated } from "@/lib/auth/authenticated";

export const GET = authenticated(async () => {
  const admins = await db.admin.findMany();

  return TypedResponse.json<AdminDTO[]>(admins.map(toAdminDTO));
});

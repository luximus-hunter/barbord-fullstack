"use server";

import { db } from "@repo/db";
import { toUserDTO } from "@/mappers/user.mapper";
import { UserDTO } from "@repo/contract";
import { TypedResponse } from "@/lib/helpers";
import { authenticated } from "@/lib/auth/authenticated";

export const GET = authenticated(async () => {
  const users = await db.user.findMany({
    where: { archived: true },
  });

  return TypedResponse.json<UserDTO[]>(users.map(toUserDTO));
});

"use server";

import { db } from "@repo/db";
import { toUserDTO } from "@/mappers/user.mapper";
import { CreateUserDTO, UserDTO } from "@repo/contract";
import { ZodErrorResponse } from "@/lib/responses";
import { TypedResponse } from "@/lib/helpers";
import { authenticated } from "@/lib/auth/authenticated";

export const GET = authenticated(async () => {
  const users = await db.user.findMany({
    where: { archived: false },
  });

  return TypedResponse.json<UserDTO[]>(users.map(toUserDTO));
});

export const POST = authenticated(async (request) => {
  const body = await request.json();
  const result = CreateUserDTO.safeParse(body);

  if (!result.success) return ZodErrorResponse(result);

  const user = await db.user.create({
    data: result.data,
  });

  return TypedResponse.json<UserDTO>(toUserDTO(user));
});

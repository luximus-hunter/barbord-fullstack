"use server";

import { db } from "@repo/db";
import { TopupDTO, CreateTopupDTO } from "@repo/contract";
import { ZodErrorResponse } from "@/lib/responses";
import { TypedResponse } from "@/lib/helpers";
import { authenticated } from "@/lib/auth/authenticated";
import { toTopupDTO } from "@/mappers/topup.mapper";

export const POST = authenticated(async (request) => {
  const body = await request.json();
  const result = CreateTopupDTO.safeParse(body);

  if (!result.success) return ZodErrorResponse(result);

  const topup = await db.topup.create({
    data: result.data,
  });

  await db.user.update({
    where: { id: result.data.userId },
    data: { saldo: { increment: result.data.amount } },
  });

  return TypedResponse.json<TopupDTO>(toTopupDTO(topup));
});

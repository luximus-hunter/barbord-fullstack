"use server";

import { db } from "@repo/db";
import { AutomaticTopupDTO, CreateAutomaticTopupDTO } from "@repo/contract";
import { ZodErrorResponse } from "@/lib/responses";
import { TypedResponse } from "@/lib/helpers";
import { authenticated } from "@/lib/auth/authenticated";
import { toAutomaticTopupDTO } from "@/mappers/automatic-topup.mapper";

export const GET = authenticated(async () => {
  const automaticTopups = await db.automaticTopup.findMany();

  return TypedResponse.json<AutomaticTopupDTO[]>(
    automaticTopups.map(toAutomaticTopupDTO),
  );
});

export const POST = authenticated(async (request) => {
  const body = await request.json();
  const result = CreateAutomaticTopupDTO.safeParse(body);

  if (!result.success) return ZodErrorResponse(result);

  const automaticTopup = await db.automaticTopup.create({
    data: result.data,
  });

  return TypedResponse.json<AutomaticTopupDTO>(
    toAutomaticTopupDTO(automaticTopup),
  );
});

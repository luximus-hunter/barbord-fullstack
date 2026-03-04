"use server";

import { authenticated } from "@/lib/auth/authenticated";
import { TypedResponse } from "@/lib/helpers";
import {
  NotFoundResponse,
  SuccessResponse,
  ZodErrorResponse,
} from "@/lib/responses";
import { toAutomaticTopupDTO } from "@/mappers/automatic-topup.mapper";
import { AutomaticTopupDTO, UpdateAutomaticTopupDTO } from "@repo/contract";
import { db } from "@repo/db";
import { NextRequest } from "next/server";

export const GET = authenticated(
  async (
    _req: NextRequest,
    ctx: RouteContext<"/api/v1/automatic-topup/[id]">,
  ) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const automaticTopup = await db.automaticTopup.findUnique({
      where: { id },
    });

    if (!automaticTopup)
      return NotFoundResponse(`Automatic top-up with id ${id} not found`);

    return TypedResponse.json<AutomaticTopupDTO>(
      toAutomaticTopupDTO(automaticTopup),
    );
  },
);

export const PUT = authenticated(
  async (
    req: NextRequest,
    ctx: RouteContext<"/api/v1/automatic-topup/[id]">,
  ) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const body = await req.json();
    const result = UpdateAutomaticTopupDTO.safeParse(body);

    if (!result.success) return ZodErrorResponse(result);

    const automaticTopup = await db.automaticTopup.findUnique({
      where: { id },
    });

    if (!automaticTopup)
      return NotFoundResponse(`Automatic top-up with id ${id} not found`);

    const updatedAutomaticTopup = await db.automaticTopup.update({
      where: { id },
      data: result.data,
    });

    return TypedResponse.json<AutomaticTopupDTO>(
      toAutomaticTopupDTO(updatedAutomaticTopup),
    );
  },
);

export const DELETE = authenticated(
  async (
    _req: NextRequest,
    ctx: RouteContext<"/api/v1/automatic-topup/[id]">,
  ) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const automaticTopup = await db.automaticTopup.findUnique({
      where: { id },
    });

    if (!automaticTopup)
      return NotFoundResponse(`Automatic top-up with id ${id} not found`);

    await db.automaticTopup.delete({
      where: { id },
    });

    return SuccessResponse();
  },
);

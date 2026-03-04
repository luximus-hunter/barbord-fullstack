"use server";

import { authenticated } from "@/lib/auth/authenticated";
import { TypedResponse } from "@/lib/helpers";
import { NotFoundResponse, ZodErrorResponse } from "@/lib/responses";
import { toUserDTO } from "@/mappers/user.mapper";
import { UpdateUserDTO, UserDTO } from "@repo/contract";
import { db } from "@repo/db";
import { NextRequest } from "next/server";

export const GET = authenticated(
  async (_req: NextRequest, ctx: RouteContext<"/api/v1/users/[id]">) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) return NotFoundResponse(`User with id ${id} not found`);

    return TypedResponse.json<UserDTO>(toUserDTO(user));
  },
);

export const PUT = authenticated(
  async (req: NextRequest, ctx: RouteContext<"/api/v1/users/[id]">) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const body = await req.json();
    const result = UpdateUserDTO.safeParse(body);

    if (!result.success) return ZodErrorResponse(result);

    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) return NotFoundResponse(`User with id ${id} not found`);

    const updatedUser = await db.user.update({
      where: { id },
      data: result.data,
    });

    return TypedResponse.json<UserDTO>(toUserDTO(updatedUser));
  },
);

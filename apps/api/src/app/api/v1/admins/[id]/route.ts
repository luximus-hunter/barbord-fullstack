"use server";

import { authenticated } from "@/lib/auth/authenticated";
import { TypedResponse } from "@/lib/helpers";
import { NotFoundResponse, ZodErrorResponse } from "@/lib/responses";
import { toAdminDTO } from "@/mappers/admin.mapper";
import { UpdateAdminDTO, AdminDTO } from "@repo/contract";
import { db } from "@repo/db";
import { NextRequest } from "next/server";

export const GET = authenticated(
  async (_req: NextRequest, ctx: RouteContext<"/api/v1/admins/[id]">) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const admin = await db.admin.findUnique({
      where: { id },
    });

    if (!admin) return NotFoundResponse(`Admin with id ${id} not found`);

    return TypedResponse.json<AdminDTO>(toAdminDTO(admin));
  },
);

export const PUT = authenticated(
  async (req: NextRequest, ctx: RouteContext<"/api/v1/admins/[id]">) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const body = await req.json();
    const result = UpdateAdminDTO.safeParse(body);

    if (!result.success) return ZodErrorResponse(result);

    const admin = await db.admin.findUnique({
      where: { id },
    });

    if (!admin) return NotFoundResponse(`Admin with id ${id} not found`);

    const updatedAdmin = await db.admin.update({
      where: { id },
      data: result.data,
    });

    return TypedResponse.json<AdminDTO>(toAdminDTO(updatedAdmin));
  },
);

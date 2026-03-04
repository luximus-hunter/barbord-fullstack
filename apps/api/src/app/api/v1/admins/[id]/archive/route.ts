import { authenticated } from "@/lib/auth/authenticated";
import { TypedResponse } from "@/lib/helpers";
import { NotFoundResponse } from "@/lib/responses";
import { toAdminDTO } from "@/mappers/admin.mapper";
import { AdminDTO } from "@repo/contract";
import { db } from "@repo/db";
import { NextRequest } from "next/server";

export const POST = authenticated(
  async (
    req: NextRequest,
    ctx: RouteContext<"/api/v1/admins/[id]/archive">,
  ) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const admin = await db.admin.findUnique({
      where: { id },
    });

    if (!admin) return NotFoundResponse(`Admin with id ${id} not found`);

    const updatedAdmin = await db.admin.update({
      where: { id },
      data: { archived: true },
    });

    return TypedResponse.json<AdminDTO>(toAdminDTO(updatedAdmin));
  },
);

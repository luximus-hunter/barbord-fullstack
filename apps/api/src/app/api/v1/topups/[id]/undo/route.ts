import { authenticated } from "@/lib/auth/authenticated";
import { NotFoundResponse, SuccessResponse } from "@/lib/responses";
import { db } from "@repo/db";
import { NextRequest } from "next/server";

export const POST = authenticated(
  async (req: NextRequest, ctx: RouteContext<"/api/v1/topups/[id]/undo">) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const topup = await db.topup.findUnique({
      where: { id },
    });

    if (!topup) return NotFoundResponse(`Topup with id ${id} not found`);

    await db.topup.delete({
      where: { id },
    });

    await db.user.update({
      where: { id: topup.userId },
      data: { saldo: { decrement: topup.amount } },
    });

    return SuccessResponse();
  },
);

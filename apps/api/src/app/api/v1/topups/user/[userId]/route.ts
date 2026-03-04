"use server";

import { db } from "@repo/db";
import { TopupDTO } from "@repo/contract";
import { TypedResponse } from "@/lib/helpers";
import { authenticated } from "@/lib/auth/authenticated";
import { toTopupDTO } from "@/mappers/topup.mapper";
import { NextRequest } from "next/server";

export const GET = authenticated(
  async (
    req: NextRequest,
    ctx: RouteContext<"/api/v1/topups/user/[userId]">,
  ) => {
    const params = await ctx.params;
    const userId = Number(params.userId);

    const topups = await db.topup.findMany({
      orderBy: { date: "desc" },
      where: { userId },
    });

    return TypedResponse.json<TopupDTO[]>(topups.map(toTopupDTO));
  },
);

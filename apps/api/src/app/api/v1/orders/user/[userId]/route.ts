"use server";

import { db } from "@repo/db";
import { OrderDTO } from "@repo/contract";
import { TypedResponse } from "@/lib/helpers";
import { authenticated } from "@/lib/auth/authenticated";
import { toOrderDTO } from "@/mappers/order.mapper";
import { NextRequest } from "next/server";

export const GET = authenticated(
  async (
    req: NextRequest,
    ctx: RouteContext<"/api/v1/orders/user/[userId]">,
  ) => {
    const params = await ctx.params;
    const userId = Number(params.userId);

    const orders = await db.order.findMany({
      orderBy: { date: "desc" },
      where: { userId },
    });

    return TypedResponse.json<OrderDTO[]>(orders.map(toOrderDTO));
  },
);

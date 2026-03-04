"use server";

import { db } from "@repo/db";
import { OrderDTO } from "@repo/contract";
import { TypedResponse } from "@/lib/helpers";
import { authenticated } from "@/lib/auth/authenticated";
import { toOrderDTO } from "@/mappers/order.mapper";
import { NextRequest } from "next/server";
import { toSettingsDTO } from "@/mappers/settings.mapper";

export const GET = authenticated(
  async (
    req: NextRequest,
    ctx: RouteContext<"/api/v1/orders/page/[page]/user/[userId]">,
  ) => {
    const params = await ctx.params;
    const page = Number(params.page);
    const userId = Number(params.userId);

    const settingsEntries = await db.settingsV2.findMany();
    const settings = toSettingsDTO(settingsEntries);
    const pageSize = settings.itemsPerPage;

    const orders = await db.order.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { date: "desc" },
      where: { userId },
    });

    return TypedResponse.json<OrderDTO[]>(orders.map(toOrderDTO));
  },
);

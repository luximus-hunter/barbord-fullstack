"use server";

import { db } from "@repo/db";
import { TopupDTO } from "@repo/contract";
import { TypedResponse } from "@/lib/helpers";
import { authenticated } from "@/lib/auth/authenticated";
import { toTopupDTO } from "@/mappers/topup.mapper";
import { NextRequest } from "next/server";
import { toSettingsDTO } from "@/mappers/settings.mapper";

export const GET = authenticated(
  async (
    req: NextRequest,
    ctx: RouteContext<"/api/v1/topups/page/[page]/user/[userId]">,
  ) => {
    const params = await ctx.params;
    const page = Number(params.page);
    const userId = Number(params.userId);

    const settingsEntries = await db.settingsV2.findMany();
    const settings = toSettingsDTO(settingsEntries);
    const pageSize = settings.itemsPerPage;

    const topups = await db.topup.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { date: "desc" },
      where: { userId },
    });

    return TypedResponse.json<TopupDTO[]>(topups.map(toTopupDTO));
  },
);

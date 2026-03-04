"use server";

import { authenticated } from "@/lib/auth/authenticated";
import { TypedResponse } from "@/lib/helpers";
import {
  NotFoundResponse,
  SuccessResponse,
  ZodErrorResponse,
} from "@/lib/responses";
import { UpdateAnnouncementDTO, AnnouncementDTO } from "@repo/contract";
import { db } from "@repo/db";
import { NextRequest } from "next/server";

export const GET = authenticated(
  async (
    _req: NextRequest,
    ctx: RouteContext<"/api/v1/announcements/[id]">,
  ) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const announcement = await db.announcement.findUnique({
      where: { id },
    });

    if (!announcement)
      return NotFoundResponse(`Announcement with id ${id} not found`);

    return TypedResponse.json<AnnouncementDTO>(announcement);
  },
);

export const PUT = authenticated(
  async (req: NextRequest, ctx: RouteContext<"/api/v1/announcements/[id]">) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const body = await req.json();
    const result = UpdateAnnouncementDTO.safeParse(body);

    if (!result.success) return ZodErrorResponse(result);

    const announcement = await db.announcement.findUnique({
      where: { id },
    });

    if (!announcement)
      return NotFoundResponse(`Announcement with id ${id} not found`);

    const updatedAnnouncement = await db.announcement.update({
      where: { id },
      data: result.data,
    });

    return TypedResponse.json<AnnouncementDTO>(updatedAnnouncement);
  },
);

export const DELETE = authenticated(
  async (
    _req: NextRequest,
    ctx: RouteContext<"/api/v1/announcements/[id]">,
  ) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const announcement = await db.announcement.findUnique({
      where: { id },
    });

    if (!announcement)
      return NotFoundResponse(`Announcement with id ${id} not found`);

    await db.announcement.delete({
      where: { id },
    });

    return SuccessResponse();
  },
);

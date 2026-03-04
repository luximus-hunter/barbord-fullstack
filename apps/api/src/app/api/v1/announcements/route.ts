"use server";

import { db } from "@repo/db";
import { toUserDTO } from "@/mappers/user.mapper";
import { AnnouncementDTO, CreateAnnouncementDTO } from "@repo/contract";
import { ZodErrorResponse } from "@/lib/responses";
import { TypedResponse } from "@/lib/helpers";
import { authenticated } from "@/lib/auth/authenticated";

export const GET = authenticated(async () => {
  const announcements = await db.announcement.findMany();

  return TypedResponse.json<AnnouncementDTO[]>(announcements);
});

export const POST = authenticated(async (request) => {
  const body = await request.json();
  const result = CreateAnnouncementDTO.safeParse(body);

  if (!result.success) return ZodErrorResponse(result);

  const announcement = await db.announcement.create({
    data: result.data,
  });

  return TypedResponse.json<AnnouncementDTO>(announcement);
});

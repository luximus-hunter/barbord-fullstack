"use server";

import { db } from "@repo/db";
import { ZodErrorResponse } from "@/lib/responses";
import { TypedResponse } from "@/lib/helpers";
import { authenticated } from "@/lib/auth/authenticated";
import { toSettingsDTO, toSettingsV2Entries } from "@/mappers/settings.mapper";
import { SettingsDTO } from "@repo/contract";

// NOTE: This GET endpoint is intentionally left unauthenticated.
// This is so the client can fetch the settings on app load without needing to authenticate first.
export const GET = async () => {
  const settingsEntries = await db.settingsV2.findMany();

  return TypedResponse.json<SettingsDTO>(toSettingsDTO(settingsEntries));
};

export const PUT = authenticated(async (request) => {
  const body = await request.json();
  const result = SettingsDTO.safeParse(body);

  if (!result.success) return ZodErrorResponse(result);

  const settingsEntries = toSettingsV2Entries(result.data);

  await db.$transaction(async (tx) => {
    for (const entry of settingsEntries) {
      await tx.settingsV2.upsert({
        where: { key: entry.key },
        update: { value: entry.value },
        create: entry,
      });
    }
  });

  return TypedResponse.json<SettingsDTO>(result.data);
});

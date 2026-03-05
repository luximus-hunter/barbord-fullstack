import { SettingsDTO } from "@repo/contract";
import { Hono } from "hono";
import { toSettingsDTO, toSettingsV2Entries } from "../mappers/settings.mapper";
import { db } from "@repo/db";
import { zValidator } from "@hono/zod-validator";

const settingsRoutes = new Hono();

settingsRoutes.get("/", async (c) => {
  const settingsEntries = await db.settingsV2.findMany();

  return c.json<SettingsDTO>(toSettingsDTO(settingsEntries));
});

settingsRoutes.put("/", zValidator("json", SettingsDTO), async (c) => {
  const data = c.req.valid("json");
  const settingsEntries = toSettingsV2Entries(data);

  await db.$transaction(async (tx) => {
    for (const entry of settingsEntries) {
      await tx.settingsV2.upsert({
        where: { key: entry.key },
        update: { value: entry.value },
        create: entry,
      });
    }
  });

  return c.json<SettingsDTO>(data);
});

export default settingsRoutes;

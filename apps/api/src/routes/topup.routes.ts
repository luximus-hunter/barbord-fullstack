import { zValidator } from "@hono/zod-validator";
import { CreateTopupDTO, TopupDTO } from "@repo/contract";
import { db } from "@repo/db";
import { Hono } from "hono";
import { toTopupDTO } from "../mappers/topup.mapper.js";
import { authenticated } from "../middleware/authenticated.js";
import { toSettingsDTO } from "../mappers/settings.mapper.js";

async function getSettings() {
  const settingsEntries = await db.settingsV2.findMany();
  return toSettingsDTO(settingsEntries);
}

const topupRoutes = new Hono();

topupRoutes.post(
  "/",
  authenticated,
  zValidator("json", CreateTopupDTO),
  async (c) => {
    const data = c.req.valid("json");

    const topup = await db.topup.create({
      data,
    });

    await db.user.update({
      where: { id: data.userId },
      data: { saldo: { increment: data.amount } },
    });

    return c.json<TopupDTO>(toTopupDTO(topup));
  },
);

topupRoutes.get("/user/:userId", authenticated, async (c) => {
  const userId = parseInt(c.req.param("userId"), 10);

  const topups = await db.topup.findMany({
    orderBy: { date: "desc" },
    where: { userId },
  });

  return c.json<TopupDTO[]>(topups.map(toTopupDTO));
});

topupRoutes.get("/page/:page", authenticated, async (c) => {
  const page = parseInt(c.req.param("page"), 10);

  const settings = await getSettings();
  const pageSize = settings.itemsPerPage;

  const topups = await db.topup.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { date: "desc" },
  });

  return c.json<TopupDTO[]>(topups.map(toTopupDTO));
});

topupRoutes.get("/page/:page/user/:userId", authenticated, async (c) => {
  const page = parseInt(c.req.param("page"), 10);
  const userId = parseInt(c.req.param("userId"), 10);

  const settings = await getSettings();
  const pageSize = settings.itemsPerPage;

  const topups = await db.topup.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { date: "desc" },
    where: { userId },
  });

  return c.json<TopupDTO[]>(topups.map(toTopupDTO));
});

topupRoutes.post("/:id/undo", authenticated, async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  const topup = await db.topup.findUnique({
    where: { id },
  });

  if (!topup) {
    return c.json({ error: `Topup with id ${id} not found` }, 404);
  }

  await db.topup.delete({
    where: { id },
  });

  await db.user.update({
    where: { id: topup.userId },
    data: { saldo: { decrement: topup.amount } },
  });

  return c.json({ success: true }, 200);
});

topupRoutes.post("/:id/approve", authenticated, async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  const topup = await db.topup.findUnique({
    where: { id },
  });

  if (!topup) {
    return c.json({ error: `Topup with id ${id} not found` }, 404);
  }

  await db.topup.update({
    where: { id },
    data: { checked: true },
  });

  return c.json({ success: true }, 200);
});

export default topupRoutes;


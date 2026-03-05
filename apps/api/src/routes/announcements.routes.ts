import { Hono } from "hono";
import { authenticated } from "../middleware/authenticated";
import { db } from "@repo/db";
import {
  CreateAnnouncementDTO,
  UpdateAnnouncementDTO,
  AnnouncementDTO,
} from "@repo/contract";
import { zValidator } from "@hono/zod-validator";

const announcements = new Hono();

announcements.get("/", authenticated, async (c) => {
  const announcements = await db.announcement.findMany();

  return c.json<AnnouncementDTO[]>(announcements);
});

announcements.post(
  "/",
  authenticated,
  zValidator("json", CreateAnnouncementDTO),
  async (c) => {
    const data = c.req.valid("json");

    const announcement = await db.announcement.create({
      data,
    });

    return c.json<AnnouncementDTO>(announcement);
  },
);

announcements.get("/:id", authenticated, async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  const announcement = await db.announcement.findUnique({
    where: { id },
  });

  if (!announcement) {
    return c.json({ error: `Announcement with id ${id} not found` }, 404);
  }

  return c.json<AnnouncementDTO>(announcement);
});

announcements.put(
  "/:id",
  authenticated,
  zValidator("json", UpdateAnnouncementDTO),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    const data = c.req.valid("json");

    const announcement = await db.announcement.update({
      where: { id },
      data,
    });

    if (!announcement) {
      return c.json({ error: `Announcement with id ${id} not found` }, 404);
    }

    return c.json<AnnouncementDTO>(announcement);
  },
);

announcements.delete("/:id", authenticated, async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  const announcement = await db.announcement.delete({
    where: { id },
  });

  if (!announcement) {
    return c.json({ error: `Announcement with id ${id} not found` }, 404);
  }

  return c.json({ success: true }, 200);
});

export default announcements;

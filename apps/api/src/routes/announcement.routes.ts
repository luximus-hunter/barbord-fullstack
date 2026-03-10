import { Hono } from 'hono';
import { authenticated } from '../middleware/authenticated.js';
import { db } from '@barbord/db';
import {
  CreateAnnouncementDTO,
  UpdateAnnouncementDTO,
  AnnouncementDTO,
} from '@barbord/contract';
import { zValidator } from '@hono/zod-validator';

const announcementRoutes = new Hono();

announcementRoutes.get('/', authenticated, async (c) => {
  const announcements = await db.announcement.findMany();

  return c.json<AnnouncementDTO[]>(announcements);
});

announcementRoutes.post(
  '/',
  authenticated,
  zValidator('json', CreateAnnouncementDTO),
  async (c) => {
    const data = c.req.valid('json');

    const announcement = await db.announcement.create({
      data,
    });

    return c.json<AnnouncementDTO>(announcement);
  },
);

announcementRoutes.get('/:id', authenticated, async (c) => {
  const id = parseInt(c.req.param('id'), 10);

  const announcement = await db.announcement.findUnique({
    where: { id },
  });

  if (!announcement) {
    return c.json({ error: `Announcement with id ${id} not found` }, 404);
  }

  return c.json<AnnouncementDTO>(announcement);
});

announcementRoutes.put(
  '/:id',
  authenticated,
  zValidator('json', UpdateAnnouncementDTO),
  async (c) => {
    const id = parseInt(c.req.param('id'), 10);
    const data = c.req.valid('json');

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

announcementRoutes.delete('/:id', authenticated, async (c) => {
  const id = parseInt(c.req.param('id'), 10);

  const announcement = await db.announcement.delete({
    where: { id },
  });

  if (!announcement) {
    return c.json({ error: `Announcement with id ${id} not found` }, 404);
  }

  return c.json({ success: true }, 200);
});

export default announcementRoutes;
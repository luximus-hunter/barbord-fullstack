import { Hono } from 'hono';
import { authenticated } from '../middleware/authenticated.js';
import { db } from '@barbord/db';
import {
  AutomaticTopupDTO,
  CreateAutomaticTopupDTO,
  UpdateAutomaticTopupDTO,
} from '@barbord/contract';
import { zValidator } from '@hono/zod-validator';
import { toAutomaticTopupDTO } from '../mappers/automatic-topup.mapper.js';

const automaticTopupRoutes = new Hono();

automaticTopupRoutes.get('/', authenticated, async (c) => {
  const automaticTopups = await db.automaticTopup.findMany();

  return c.json<AutomaticTopupDTO[]>(automaticTopups.map(toAutomaticTopupDTO));
});

automaticTopupRoutes.post(
  '/',
  authenticated,
  zValidator('json', CreateAutomaticTopupDTO),
  async (c) => {
    const data = c.req.valid('json');

    const automaticTopup = await db.automaticTopup.create({
      data,
    });

    return c.json<AutomaticTopupDTO>(toAutomaticTopupDTO(automaticTopup));
  },
);

automaticTopupRoutes.get('/:id', authenticated, async (c) => {
  const id = parseInt(c.req.param('id'), 10);

  const automaticTopup = await db.automaticTopup.findUnique({
    where: { id },
  });

  if (!automaticTopup) {
    return c.json({ error: `Automatic top-up with id ${id} not found` }, 404);
  }

  return c.json<AutomaticTopupDTO>(toAutomaticTopupDTO(automaticTopup));
});

automaticTopupRoutes.put(
  '/:id',
  authenticated,
  zValidator('json', UpdateAutomaticTopupDTO),
  async (c) => {
    const id = parseInt(c.req.param('id'), 10);
    const data = c.req.valid('json');

    const automaticTopup = await db.automaticTopup.update({
      where: { id },
      data,
    });

    if (!automaticTopup) {
      return c.json({ error: `Automatic top-up with id ${id} not found` }, 404);
    }

    return c.json<AutomaticTopupDTO>(toAutomaticTopupDTO(automaticTopup));
  },
);

automaticTopupRoutes.delete('/:id', authenticated, async (c) => {
  const id = parseInt(c.req.param('id'), 10);

  const automaticTopup = await db.automaticTopup.delete({
    where: { id },
  });

  if (!automaticTopup) {
    return c.json({ error: `Automatic top-up with id ${id} not found` }, 404);
  }

  return c.json({ success: true }, 200);
});

export default automaticTopupRoutes;
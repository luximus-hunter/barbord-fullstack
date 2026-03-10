import { Hono } from 'hono';
import { authenticated } from '../middleware/authenticated.js';
import { db } from '@barbord/db';
import { LoginDTO, AuthUserDTO } from '@barbord/contract';
import { zValidator } from '@hono/zod-validator';
import { verifyPassword } from '../lib/password.js';
import { sign } from 'hono/jwt';

const authRoutes = new Hono();

authRoutes.post('/', zValidator('json', LoginDTO), async (c) => {
  const data = c.req.valid('json');
  const { username, password } = data;

  const admin = await db.admin.findUnique({
    where: { username },
  });
  if (!admin) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const valid = await verifyPassword(password, admin.password);
  if (!valid) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const authUser: AuthUserDTO = {
    id: admin.id,
    username: admin.username,
    displayname: admin.displayname,
  };

  const token = await sign(
    {
      ...authUser,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 60 minutes
    },
    process.env.JWT_SECRET || '',
    'HS256',
  );

  return c.json<AuthUserDTO>({ ...authUser, token });
});

authRoutes.get('/', authenticated, async (c) => {
  const authUser = c.get('authUser');

  return c.json<AuthUserDTO>(authUser);
});

export default authRoutes;
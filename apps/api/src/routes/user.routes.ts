import { Hono } from "hono";
import { authenticated } from "../middleware/authenticated";
import { db } from "@repo/db";
import { toUserDTO } from "../mappers/user.mapper";
import { CreateUserDTO, UpdateUserDTO, UserDTO } from "@repo/contract";
import { zValidator } from "@hono/zod-validator";

const users = new Hono();

users.get("/", authenticated, async (c) => {
  const users = await db.user.findMany({
    where: { archived: false },
  });

  return c.json<UserDTO[]>(users.map(toUserDTO));
});

users.post("/", authenticated, zValidator("json", CreateUserDTO), async (c) => {
  const data = c.req.valid("json");

  const user = await db.user.create({
    data,
  });

  return c.json<UserDTO>(toUserDTO(user));
});

users.get("/:id", authenticated, async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  const user = await db.user.findUnique({
    where: { id },
  });

  if (!user) {
    return c.json({ error: `User with id ${id} not found` }, 404);
  }

  return c.json<UserDTO>(toUserDTO(user));
});

users.put(
  "/:id",
  authenticated,
  zValidator("json", UpdateUserDTO),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    const data = c.req.valid("json");

    const user = await db.user.update({
      where: { id },
      data,
    });

    if (!user) {
      return c.json({ error: `User with id ${id} not found` }, 404);
    }

    return c.json<UserDTO>(toUserDTO(user));
  },
);

users.post("/:id/archive", authenticated, async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  const user = await db.user.update({
    where: { id },
    data: { archived: true },
  });

  if (!user) {
    return c.json({ error: `User with id ${id} not found` }, 404);
  }

  return c.json<UserDTO>(toUserDTO(user));
});

users.post("/:id/unarchive", authenticated, async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  const user = await db.user.update({
    where: { id },
    data: { archived: false },
  });

  if (!user) {
    return c.json({ error: `User with id ${id} not found` }, 404);
  }

  return c.json<UserDTO>(toUserDTO(user));
});

users.get("/all", authenticated, async (c) => {
  const users = await db.user.findMany();

  return c.json<UserDTO[]>(users.map(toUserDTO));
});

users.get("/archived", authenticated, async (c) => {
  const users = await db.user.findMany({
    where: { archived: true },
  });

  return c.json<UserDTO[]>(users.map(toUserDTO));
});

export default users;

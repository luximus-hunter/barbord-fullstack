import { Hono } from "hono";
import { authenticated } from "../middleware/authenticated.js";
import { db } from "@repo/db";
import { toAdminDTO } from "../mappers/admin.mapper.js";
import { CreateAdminDTO, UpdateAdminDTO, AdminDTO } from "@repo/contract";
import { zValidator } from "@hono/zod-validator";

const adminRoutes = new Hono();

adminRoutes.get("/", async (c) => {
  const admins = await db.admin.findMany({
    where: { archived: false },
  });

  return c.json<AdminDTO[]>(admins.map(toAdminDTO));
});

adminRoutes.post("/", authenticated, zValidator("json", CreateAdminDTO), async (c) => {
  const data = c.req.valid("json");

  const admin = await db.admin.create({
    data,
  });

  return c.json<AdminDTO>(toAdminDTO(admin));
});

adminRoutes.get("/:id", authenticated, async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  const admin = await db.admin.findUnique({
    where: { id },
  });

  if (!admin) {
    return c.json({ error: `Admin with id ${id} not found` }, 404);
  }

  return c.json<AdminDTO>(toAdminDTO(admin));
});

adminRoutes.put(
  "/:id",
  authenticated,
  zValidator("json", UpdateAdminDTO),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    const data = c.req.valid("json");

    const admin = await db.admin.update({
      where: { id },
      data,
    });

    if (!admin) {
      return c.json({ error: `Admin with id ${id} not found` }, 404);
    }

    return c.json<AdminDTO>(toAdminDTO(admin));
  },
);

adminRoutes.post("/:id/archive", authenticated, async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  const admin = await db.admin.update({
    where: { id },
    data: { archived: true },
  });

  if (!admin) {
    return c.json({ error: `Admin with id ${id} not found` }, 404);
  }

  return c.json<AdminDTO>(toAdminDTO(admin));
});

adminRoutes.post("/:id/unarchive", authenticated, async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  const admin = await db.admin.update({
    where: { id },
    data: { archived: false },
  });

  if (!admin) {
    return c.json({ error: `Admin with id ${id} not found` }, 404);
  }

  return c.json<AdminDTO>(toAdminDTO(admin));
});

adminRoutes.get("/all", authenticated, async (c) => {
  const admins = await db.admin.findMany();

  return c.json<AdminDTO[]>(admins.map(toAdminDTO));
});

adminRoutes.get("/archived", authenticated, async (c) => {
  const admins = await db.admin.findMany({
    where: { archived: true },
  });

  return c.json<AdminDTO[]>(admins.map(toAdminDTO));
});

export default adminRoutes;


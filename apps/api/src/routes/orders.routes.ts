import { zValidator } from "@hono/zod-validator";
import { CreateOrderDTO, OrderDTO } from "@repo/contract";
import { db } from "@repo/db";
import { Hono } from "hono";
import { toOrderDTO } from "../mappers/order.mapper";
import { authenticated } from "../middleware/authenticated";
import { toSettingsDTO } from "../mappers/settings.mapper";
import { toUserDTO } from "../mappers/user.mapper";

async function getSettings() {
  const settingsEntries = await db.settingsV2.findMany();
  return toSettingsDTO(settingsEntries);
}

const orders = new Hono();

orders.post(
  "/",
  authenticated,
  zValidator("json", CreateOrderDTO),
  async (c) => {
    const data = c.req.valid("json");

    const order = await db.order.create({
      data,
    });

    const user = await db.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      return c.json({ error: `User with id ${data.userId} not found` }, 404);
    }
    const userDTO = toUserDTO(user);

    const settings = await getSettings();

    let orderTotal = data.productPrice * data.quantity;

    if (userDTO.saldo < settings.fineAt) {
      orderTotal += settings.fineAmount * data.quantity;
    }

    await db.user.update({
      where: { id: data.userId },
      data: { saldo: { decrement: orderTotal } },
    });

    return c.json<OrderDTO>(toOrderDTO(order));
  },
);

// This route is unprotected so the user can see their history
orders.get("/user/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"), 10);

  const orders = await db.order.findMany({
    orderBy: { date: "desc" },
    where: { userId },
  });

  return c.json<OrderDTO[]>(orders.map(toOrderDTO));
});

orders.get("/page/:page", authenticated, async (c) => {
  const page = parseInt(c.req.param("page"), 10);

  const settings = await getSettings();
  const pageSize = settings.itemsPerPage;

  const orders = await db.order.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { date: "desc" },
  });

  return c.json<OrderDTO[]>(orders.map(toOrderDTO));
});

orders.get("/page/:page/user/:userId", authenticated, async (c) => {
  const page = parseInt(c.req.param("page"), 10);
  const userId = parseInt(c.req.param("userId"), 10);

  const settings = await getSettings();
  const pageSize = settings.itemsPerPage;

  const orders = await db.order.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { date: "desc" },
    where: { userId },
  });

  return c.json<OrderDTO[]>(orders.map(toOrderDTO));
});

orders.post("/:id/undo", authenticated, async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  const order = await db.order.findUnique({
    where: { id },
  });

  if (!order) {
    return c.json({ error: `Order with id ${id} not found` }, 404);
  }
  const orderDTO = toOrderDTO(order);

  const orderTotal =
    orderDTO.productPrice * orderDTO.quantity + (orderDTO.fine || 0);

  await db.order.delete({
    where: { id },
  });

  await db.user.update({
    where: { id: order.userId },
    data: { saldo: { increment: orderTotal } },
  });

  return c.json({ success: true }, 200);
});

export default orders;

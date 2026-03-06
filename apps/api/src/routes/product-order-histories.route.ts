import { db } from "@repo/db";
import { Hono } from "hono";
import { authenticated } from "../middleware/authenticated.js";
import {
  CreateProductOrderHistoryDTO,
  CreateProductOrderHistoryRowDTO,
  ProductOrderHistoryDTO,
  ProductOrderHistoryRowDTO,
  UpdateProductOrderHistoryDTO,
  UpdateProductOrderHistoryRowDTO,
} from "@repo/contract";
import { toProductOrderHistoryDTO } from "../mappers/product-order-history.mapper.js";
import { zValidator } from "@hono/zod-validator";

const productOrderHistoryRoutes = new Hono();

productOrderHistoryRoutes.get("/", authenticated, async (c) => {
  const histories = await db.itemOrderHistory.findMany({
    orderBy: { date: "desc" },
  });

  return c.json<ProductOrderHistoryDTO[]>(
    histories.map(toProductOrderHistoryDTO),
  );
});

productOrderHistoryRoutes.post(
  "/",
  authenticated,
  zValidator("json", CreateProductOrderHistoryDTO),
  async (c) => {
    const data = await c.req.json();

    const newHistory = await db.itemOrderHistory.create({
      data,
    });

    return c.json<ProductOrderHistoryDTO>(toProductOrderHistoryDTO(newHistory));
  },
);

productOrderHistoryRoutes.get("/:orderId", authenticated, async (c) => {
  const orderId = parseInt(c.req.param("orderId"), 10);

  const history = await db.itemOrderHistory.findUnique({
    where: { id: orderId },
  });

  if (!history) {
    return c.json(
      { error: `Product order history with id ${orderId} not found` },
      404,
    );
  }

  return c.json<ProductOrderHistoryDTO>(toProductOrderHistoryDTO(history));
});

productOrderHistoryRoutes.put(
  "/:orderId",
  authenticated,
  zValidator("json", UpdateProductOrderHistoryDTO),
  async (c) => {
    const orderId = parseInt(c.req.param("orderId"), 10);
    const data = await c.req.json();

    const updatedHistory = await db.itemOrderHistory.update({
      where: { id: orderId },
      data,
    });

    if (!updatedHistory) {
      return c.json(
        { error: `Product order history with id ${orderId} not found` },
        404,
      );
    }

    return c.json<ProductOrderHistoryDTO>(
      toProductOrderHistoryDTO(updatedHistory),
    );
  },
);

productOrderHistoryRoutes.delete("/:orderId", authenticated, async (c) => {
  const orderId = parseInt(c.req.param("orderId"), 10);

  const deletedHistory = await db.itemOrderHistory.delete({
    where: { id: orderId },
  });

  if (!deletedHistory) {
    return c.json(
      { error: `Product order history with id ${orderId} not found` },
      404,
    );
  }

  return c.json({ success: true }, 200);
});

productOrderHistoryRoutes.get("/:orderId/rows", authenticated, async (c) => {
  const orderId = parseInt(c.req.param("orderId"), 10);

  const rows = await db.itemOrderHistoryRow.findMany({
    where: { itemOrderHistoryId: orderId },
  });

  return c.json<ProductOrderHistoryRowDTO[]>(rows);
});

productOrderHistoryRoutes.post(
  "/:orderId/rows",
  authenticated,
  zValidator("json", CreateProductOrderHistoryRowDTO),
  async (c) => {
    const orderId = parseInt(c.req.param("orderId"), 10);
    const data = await c.req.json();

    const newRow = await db.itemOrderHistoryRow.create({
      data: { ...data, itemOrderHistoryId: orderId },
    });

    return c.json<ProductOrderHistoryRowDTO>(newRow);
  },
);

productOrderHistoryRoutes.put(
  "/rows/:orderRowId",
  authenticated,
  zValidator("json", UpdateProductOrderHistoryRowDTO),
  async (c) => {
    const orderRowId = parseInt(c.req.param("orderRowId"), 10);
    const data = await c.req.json();

    const updatedRow = await db.itemOrderHistoryRow.update({
      where: { id: orderRowId },
      data,
    });

    if (!updatedRow) {
      return c.json(
        { error: `Product order history row with id ${orderRowId} not found` },
        404,
      );
    }

    return c.json<ProductOrderHistoryRowDTO>(updatedRow);
  },
);

productOrderHistoryRoutes.delete(
  "/rows/:orderRowId",
  authenticated,
  async (c) => {
    const orderRowId = parseInt(c.req.param("orderRowId"), 10);

    const deletedRow = await db.itemOrderHistoryRow.delete({
      where: { id: orderRowId },
    });

    if (!deletedRow) {
      return c.json(
        { error: `Product order history row with id ${orderRowId} not found` },
        404,
      );
    }

    return c.json({ success: true }, 200);
  },
);

export default productOrderHistoryRoutes;


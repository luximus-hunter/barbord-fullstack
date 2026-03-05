import { Hono } from "hono";
import { authenticated } from "../middleware/authenticated.js";
import { db } from "@barbord/db";
import { toProductDTO } from "../mappers/product.mapper.js";
import {
  CreateProductDTO,
  UpdateProductDTO,
  ProductDTO,
  ProductStockDTO,
} from "@barbord/contract";
import { zValidator } from "@hono/zod-validator";
import { toProductStockHistoryDTO } from "../mappers/product-stock-history.mapper.js";

const productRoutes = new Hono();

productRoutes.get("/", authenticated, async (c) => {
  const products = await db.item.findMany({
    where: { archived: false },
  });

  return c.json<ProductDTO[]>(products.map(toProductDTO));
});

productRoutes.post(
  "/",
  authenticated,
  zValidator("json", CreateProductDTO),
  async (c) => {
    const data = c.req.valid("json");

    const product = await db.item.create({
      data,
    });

    return c.json<ProductDTO>(toProductDTO(product));
  },
);

productRoutes.get("/:id", authenticated, async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  const product = await db.item.findUnique({
    where: { id },
  });

  if (!product) {
    return c.json({ error: `Product with id ${id} not found` }, 404);
  }

  return c.json<ProductDTO>(toProductDTO(product));
});

productRoutes.put(
  "/:id",
  authenticated,
  zValidator("json", UpdateProductDTO),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    const data = c.req.valid("json");

    const product = await db.item.update({
      where: { id },
      data,
    });

    if (!product) {
      return c.json({ error: `Product with id ${id} not found` }, 404);
    }

    return c.json<ProductDTO>(toProductDTO(product));
  },
);

productRoutes.post("/:id/archive", authenticated, async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  const product = await db.item.update({
    where: { id },
    data: { archived: true },
  });

  if (!product) {
    return c.json({ error: `Product with id ${id} not found` }, 404);
  }

  return c.json<ProductDTO>(toProductDTO(product));
});

productRoutes.post("/:id/unarchive", authenticated, async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  const product = await db.item.update({
    where: { id },
    data: { archived: false },
  });

  if (!product) {
    return c.json({ error: `Product with id ${id} not found` }, 404);
  }

  return c.json<ProductDTO>(toProductDTO(product));
});

productRoutes.get("/all", authenticated, async (c) => {
  const products = await db.item.findMany();

  return c.json<ProductDTO[]>(products.map(toProductDTO));
});

productRoutes.get("/archived", authenticated, async (c) => {
  const products = await db.item.findMany({
    where: { archived: true },
  });

  return c.json<ProductDTO[]>(products.map(toProductDTO));
});

productRoutes.get("/stock", authenticated, async (c) => {
  const lastProductStockHistory = await db.itemStockHistory.findFirst({
    orderBy: { date: "desc" },
  });

  if (!lastProductStockHistory) {
    return c.json(
      { error: "No stock history found. Can't compare to nothing" },
      404,
    );
  }

  const mappedLastProductStockHistory = toProductStockHistoryDTO(
    lastProductStockHistory,
  );
  const productStockHistoryRows = await db.itemStockHistoryRow.findMany({
    where: { itemStockHistoryId: mappedLastProductStockHistory.id },
  });

  const productOrderHistoriesRows = await db.itemOrderHistoryRow.findMany({
    where: {
      itemOrderHistory: { date: { gt: mappedLastProductStockHistory.date } },
    },
  });
  const orders = await db.order.findMany({
    where: { date: { gt: mappedLastProductStockHistory.date } },
  });

  const stockCounts: Record<number, number> = {};

  productStockHistoryRows.forEach((row) => {
    stockCounts[row.itemId] = row.stockCounted;
  });

  orders.forEach((order) => {
    if (stockCounts[order.productId] !== undefined) {
      stockCounts[order.productId] -= order.quantity;
    } else {
      stockCounts[order.productId] = -order.quantity;
    }
  });

  productOrderHistoriesRows.forEach((row) => {
    if (stockCounts[row.itemId] !== undefined) {
      stockCounts[row.itemId] += row.amount;
    } else {
      stockCounts[row.itemId] = row.amount;
    }
  });

  const productStock: ProductStockDTO[] = Object.entries(stockCounts).map(
    ([productId, stockCount]) => ({
      productId: parseInt(productId, 10),
      stockCount,
    }),
  );

  return c.json<ProductStockDTO[]>(productStock);
});

export default productRoutes;


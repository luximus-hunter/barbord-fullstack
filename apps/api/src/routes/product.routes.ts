import { Hono } from "hono";
import { authenticated } from "../middleware/authenticated";
import { db } from "@repo/db";
import { toProductDTO } from "../mappers/product.mapper";
import { CreateProductDTO, UpdateProductDTO, ProductDTO } from "@repo/contract";
import { zValidator } from "@hono/zod-validator";

const products = new Hono();

products.get("/", authenticated, async (c) => {
  const products = await db.item.findMany({
    where: { archived: false },
  });

  return c.json<ProductDTO[]>(products.map(toProductDTO));
});

products.post(
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

products.get("/:id", authenticated, async (c) => {
  const id = parseInt(c.req.param("id"), 10);

  const product = await db.item.findUnique({
    where: { id },
  });

  if (!product) {
    return c.json({ error: `Product with id ${id} not found` }, 404);
  }

  return c.json<ProductDTO>(toProductDTO(product));
});

products.put(
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

products.post("/:id/archive", authenticated, async (c) => {
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

products.post("/:id/unarchive", authenticated, async (c) => {
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

products.get("/all", authenticated, async (c) => {
  const products = await db.item.findMany();

  return c.json<ProductDTO[]>(products.map(toProductDTO));
});

products.get("/archived", authenticated, async (c) => {
  const products = await db.item.findMany({
    where: { archived: true },
  });

  return c.json<ProductDTO[]>(products.map(toProductDTO));
});

export default products;

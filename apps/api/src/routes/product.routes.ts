import { Hono } from "hono";
import { authenticated } from "../middleware/authenticated";
import { db } from "@repo/db";
import { toProductDTO } from "../mappers/product.mapper";
import { CreateProductDTO, UpdateProductDTO, ProductDTO } from "@repo/contract";
import { zValidator } from "@hono/zod-validator";

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

export default productRoutes;

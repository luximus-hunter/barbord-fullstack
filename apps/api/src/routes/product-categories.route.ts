import { Hono } from 'hono';
import { authenticated } from '../middleware/authenticated.js';
import { db } from '@barbord/db';
import {
  UpdateProductCategoryDTO,
  ProductCategoryDTO,
  CreateProductCategoryDTO,
} from '@barbord/contract';
import { zValidator } from '@hono/zod-validator';

const productCategoryRoutes = new Hono();

productCategoryRoutes.get('/', authenticated, async (c) => {
  const productCategories = await db.itemCategory.findMany();

  return c.json<ProductCategoryDTO[]>(productCategories);
});

productCategoryRoutes.post(
  '/',
  authenticated,
  zValidator('json', CreateProductCategoryDTO),
  async (c) => {
    const data = c.req.valid('json');

    const productCategory = await db.itemCategory.create({
      data,
    });

    return c.json<ProductCategoryDTO>(productCategory);
  },
);

productCategoryRoutes.get('/:id', authenticated, async (c) => {
  const id = parseInt(c.req.param('id'), 10);

  const productCategory = await db.itemCategory.findUnique({
    where: { id },
  });

  if (!productCategory) {
    return c.json({ error: `Product category with id ${id} not found` }, 404);
  }

  return c.json<ProductCategoryDTO>(productCategory);
});

productCategoryRoutes.put(
  '/:id',
  authenticated,
  zValidator('json', UpdateProductCategoryDTO),
  async (c) => {
    const id = parseInt(c.req.param('id'), 10);
    const data = c.req.valid('json');

    const productCategory = await db.itemCategory.update({
      where: { id },
      data,
    });

    if (!productCategory) {
      return c.json({ error: `Product category with id ${id} not found` }, 404);
    }

    return c.json<ProductCategoryDTO>(productCategory);
  },
);

productCategoryRoutes.delete('/:id', authenticated, async (c) => {
  const id = parseInt(c.req.param('id'), 10);

  const productCategory = await db.itemCategory.delete({
    where: { id },
  });

  if (!productCategory) {
    return c.json({ error: `Product category with id ${id} not found` }, 404);
  }

  return c.json({ success: true }, 200);
});

export default productCategoryRoutes;
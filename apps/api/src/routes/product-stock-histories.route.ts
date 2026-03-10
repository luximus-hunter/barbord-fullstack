import { db } from '@barbord/db';
import { Hono } from 'hono';
import { authenticated } from '../middleware/authenticated.js';
import {
  CreateProductStockHistoryDTO,
  CreateProductStockHistoryRowDTO,
  ProductStockHistoryDTO,
  ProductStockHistoryRowDTO,
  UpdateProductStockHistoryDTO,
  UpdateProductStockHistoryRowDTO,
} from '@barbord/contract';
import { toProductStockHistoryDTO } from '../mappers/product-stock-history.mapper.js';
import { zValidator } from '@hono/zod-validator';

const productStockHistoryRoutes = new Hono();

productStockHistoryRoutes.get('/', authenticated, async (c) => {
  const histories = await db.itemStockHistory.findMany({
    orderBy: { date: 'desc' },
  });

  return c.json<ProductStockHistoryDTO[]>(
    histories.map(toProductStockHistoryDTO),
  );
});

productStockHistoryRoutes.post(
  '/',
  authenticated,
  zValidator('json', CreateProductStockHistoryDTO),
  async (c) => {
    const data = await c.req.json();

    const newHistory = await db.itemStockHistory.create({
      data,
    });

    return c.json<ProductStockHistoryDTO>(toProductStockHistoryDTO(newHistory));
  },
);

productStockHistoryRoutes.get('/:stockId', authenticated, async (c) => {
  const stockId = parseInt(c.req.param('stockId'), 10);

  const history = await db.itemStockHistory.findUnique({
    where: { id: stockId },
  });

  if (!history) {
    return c.json(
      { error: `Product stock history with id ${stockId} not found` },
      404,
    );
  }

  return c.json<ProductStockHistoryDTO>(toProductStockHistoryDTO(history));
});

productStockHistoryRoutes.put(
  '/:stockId',
  authenticated,
  zValidator('json', UpdateProductStockHistoryDTO),
  async (c) => {
    const stockId = parseInt(c.req.param('stockId'), 10);
    const data = await c.req.json();

    const updatedHistory = await db.itemStockHistory.update({
      where: { id: stockId },
      data,
    });

    if (!updatedHistory) {
      return c.json(
        { error: `Product stock history with id ${stockId} not found` },
        404,
      );
    }

    return c.json<ProductStockHistoryDTO>(
      toProductStockHistoryDTO(updatedHistory),
    );
  },
);

productStockHistoryRoutes.delete('/:stockId', authenticated, async (c) => {
  const stockId = parseInt(c.req.param('stockId'), 10);

  const deletedHistory = await db.itemStockHistory.delete({
    where: { id: stockId },
  });

  if (!deletedHistory) {
    return c.json(
      { error: `Product stock history with id ${stockId} not found` },
      404,
    );
  }

  return c.json({ success: true }, 200);
});

productStockHistoryRoutes.get('/:stockId/rows', authenticated, async (c) => {
  const stockId = parseInt(c.req.param('stockId'), 10);

  const rows = await db.itemStockHistoryRow.findMany({
    where: { itemStockHistoryId: stockId },
  });

  return c.json<ProductStockHistoryRowDTO[]>(rows);
});

productStockHistoryRoutes.post(
  '/:stockId/rows',
  authenticated,
  zValidator('json', CreateProductStockHistoryRowDTO),
  async (c) => {
    const stockId = parseInt(c.req.param('stockId'), 10);
    const data = await c.req.json();

    const newRow = await db.itemStockHistoryRow.create({
      data: { ...data, itemStockHistoryId: stockId },
    });

    return c.json<ProductStockHistoryRowDTO>(newRow);
  },
);

productStockHistoryRoutes.put(
  '/rows/:stockRowId',
  authenticated,
  zValidator('json', UpdateProductStockHistoryRowDTO),
  async (c) => {
    const stockRowId = parseInt(c.req.param('stockRowId'), 10);
    const data = await c.req.json();

    const updatedRow = await db.itemStockHistoryRow.update({
      where: { id: stockRowId },
      data,
    });

    if (!updatedRow) {
      return c.json(
        { error: `Product stock history row with id ${stockRowId} not found` },
        404,
      );
    }

    return c.json<ProductStockHistoryRowDTO>(updatedRow);
  },
);

productStockHistoryRoutes.delete(
  '/rows/:stockRowId',
  authenticated,
  async (c) => {
    const stockRowId = parseInt(c.req.param('stockRowId'), 10);

    const deletedRow = await db.itemStockHistoryRow.delete({
      where: { id: stockRowId },
    });

    if (!deletedRow) {
      return c.json(
        { error: `Product stock history row with id ${stockRowId} not found` },
        404,
      );
    }

    return c.json({ success: true }, 200);
  },
);

export default productStockHistoryRoutes;
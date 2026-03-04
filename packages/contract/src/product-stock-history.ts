import { z } from "zod";

export const ProductStockHistoryDTO = z
  .object({
    id: z.number(),
    adminId: z.number(),
    date: z.string(), // ISO representation
  })
  .strict();

export const ProductStockHistoryRowDTO = z
  .object({
    id: z.number(),
    itemStockHistoryId: z.number(),
    itemId: z.number(),
    stockCounted: z.number(),
  })
  .strict();

export const CreateProductStockHistoryDTO = ProductStockHistoryDTO.pick({
  adminId: true,
}).strict();

export const UpdateProductStockHistoryDTO = ProductStockHistoryDTO.pick({
  date: true,
})
  .partial()
  .strict();

export const CreateProductStockHistoryRowDTO = ProductStockHistoryRowDTO.pick({
  itemStockHistoryId: true,
  itemId: true,
  stockCounted: true,
}).strict();

export const UpdateProductStockHistoryRowDTO = ProductStockHistoryRowDTO.pick({
  stockCounted: true,
})
  .partial()
  .strict();

export type ProductStockHistoryDTO = z.infer<typeof ProductStockHistoryDTO>;
export type CreateProductStockHistoryDTO = z.infer<
  typeof CreateProductStockHistoryDTO
>;
export type UpdateProductStockHistoryDTO = z.infer<
  typeof UpdateProductStockHistoryDTO
>;

export type ProductStockHistoryRowDTO = z.infer<
  typeof ProductStockHistoryRowDTO
>;
export type CreateProductStockHistoryRowDTO = z.infer<
  typeof CreateProductStockHistoryRowDTO
>;
export type UpdateProductStockHistoryRowDTO = z.infer<
  typeof UpdateProductStockHistoryRowDTO
>;

import { z } from "zod";

export const ProductOrderHistoryDTO = z
  .object({
    id: z.number(),
    adminId: z.number(),
    date: z.string(), // ISO representation
  })
  .strict();

export const ProductOrderHistoryRowDTO = z
  .object({
    id: z.number(),
    itemOrderHistoryId: z.number(),
    itemId: z.number(),
    amount: z.number(),
  })
  .strict();

export const CreateProductOrderHistoryDTO = ProductOrderHistoryDTO.pick({
  adminId: true,
}).strict();

export const UpdateProductOrderHistoryDTO = ProductOrderHistoryDTO.pick({
  date: true,
})
  .partial()
  .strict();

export const CreateProductOrderHistoryRowDTO = ProductOrderHistoryRowDTO.pick({
  itemOrderHistoryId: true,
  itemId: true,
  amount: true,
}).strict();

export const UpdateProductOrderHistoryRowDTO = ProductOrderHistoryRowDTO.pick({
  amount: true,
})
  .partial()
  .strict();

export type ProductOrderHistoryDTO = z.infer<typeof ProductOrderHistoryDTO>;
export type CreateProductOrderHistoryDTO = z.infer<
  typeof CreateProductOrderHistoryDTO
>;
export type UpdateProductOrderHistoryDTO = z.infer<
  typeof UpdateProductOrderHistoryDTO
>;

export type ProductOrderHistoryRowDTO = z.infer<
  typeof ProductOrderHistoryRowDTO
>;
export type CreateProductOrderHistoryRowDTO = z.infer<
  typeof CreateProductOrderHistoryRowDTO
>;
export type UpdateProductOrderHistoryRowDTO = z.infer<
  typeof UpdateProductOrderHistoryRowDTO
>;

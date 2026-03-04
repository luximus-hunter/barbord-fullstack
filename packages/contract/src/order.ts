import { z } from "zod";

export const OrderDTO = z
  .object({
    id: z.number(),
    userId: z.number(),
    productId: z.number(),
    productPrice: z.number(),
    quantity: z.number(),
    fine: z.number().nullable(),
    date: z.string(), // ISO representation
  })
  .strict();

export const CreateOrderDTO = OrderDTO.pick({
  userId: true,
  productId: true,
  productPrice: true,
  quantity: true,
  fine: true,
}).strict();

// No update DTO, it can be undone, but not updated

export type OrderDTO = z.infer<typeof OrderDTO>;
export type CreateOrderDTO = z.infer<typeof CreateOrderDTO>;

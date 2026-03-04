import { OrderDTO } from "@repo/contract";
import { Order } from "@repo/db";

export function toOrderDTO(order: Order): OrderDTO {
  return {
    ...order,
    productPrice: order.productPrice.toNumber(),
    fine: order.fine?.toNumber() || null,
    date: order.date.toISOString(),
  };
}

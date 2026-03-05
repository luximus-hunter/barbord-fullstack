import { OrderDTO } from "@barbord/contract";
import { Order } from "@barbord/db";

export function toOrderDTO(order: Order): OrderDTO {
  return {
    ...order,
    productPrice: order.productPrice.toNumber(),
    fine: order.fine?.toNumber() || null,
    date: order.date.toISOString(),
  };
}

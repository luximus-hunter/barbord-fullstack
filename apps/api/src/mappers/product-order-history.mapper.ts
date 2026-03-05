import { ProductOrderHistoryDTO } from "@repo/contract";
import { ItemOrderHistory } from "@repo/db";

export function toProductOrderHistoryDTO(
  history: ItemOrderHistory,
): ProductOrderHistoryDTO {
  return {
    ...history,
    date: history.date.toISOString(),
  };
}

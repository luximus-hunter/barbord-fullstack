import { ProductOrderHistoryDTO } from "@barbord/contract";
import { ItemOrderHistory } from "@barbord/db";

export function toProductOrderHistoryDTO(
  history: ItemOrderHistory,
): ProductOrderHistoryDTO {
  return {
    ...history,
    date: history.date.toISOString(),
  };
}

import { ProductStockHistoryDTO } from "@repo/contract";
import { ItemStockHistory } from "@repo/db";

export function toProductStockHistoryDTO(
  history: ItemStockHistory,
): ProductStockHistoryDTO {
  return {
    ...history,
    date: history.date.toISOString(),
  };
}

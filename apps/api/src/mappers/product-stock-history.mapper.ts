import { ProductStockHistoryDTO } from "@barbord/contract";
import { ItemStockHistory } from "@barbord/db";

export function toProductStockHistoryDTO(
  history: ItemStockHistory,
): ProductStockHistoryDTO {
  return {
    ...history,
    date: history.date.toISOString(),
  };
}

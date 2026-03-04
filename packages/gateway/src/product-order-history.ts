import {
  ProductOrderHistoryDTO,
  CreateProductOrderHistoryDTO,
  UpdateProductOrderHistoryDTO,
  ProductOrderHistoryRowDTO,
  CreateProductOrderHistoryRowDTO,
  UpdateProductOrderHistoryRowDTO,
} from "@repo/contract";
import { fetchWithSchema } from "./lib/fetchWithSchema";

export const productOrderHistoryGateway = (baseUrl: string) => ({
  get: () =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/product-order-history",
      responseSchema: ProductOrderHistoryDTO,
    }),
  getRowsById: (historyId: number) =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/product-order-history/" + historyId + "/rows",
      responseSchema: ProductOrderHistoryRowDTO,
    }),
  create: (body: CreateProductOrderHistoryDTO) =>
    fetchWithSchema({
      useToken: true,
      method: "POST",
      url: baseUrl + "/product-order-history",
      body,
    }),
  update: (historyId: number, body: UpdateProductOrderHistoryDTO) =>
    fetchWithSchema({
      useToken: true,
      method: "PUT",
      url: baseUrl + "/product-order-history/" + historyId,
      body,
    }),
  delete: (historyId: number) =>
    fetchWithSchema({
      useToken: true,
      method: "DELETE",
      url: baseUrl + "/product-order-history/" + historyId,
    }),
  createRow: (historyId: number, body: CreateProductOrderHistoryRowDTO) =>
    fetchWithSchema({
      useToken: true,
      method: "POST",
      url: baseUrl + "/product-order-history/" + historyId + "/rows",
      body,
    }),
  updateRow: (rowId: number, body: UpdateProductOrderHistoryRowDTO) =>
    fetchWithSchema({
      useToken: true,
      method: "PUT",
      url: baseUrl + "/product-order-history/rows/" + rowId,
      body,
    }),
  deleteRow: (rowId: number) =>
    fetchWithSchema({
      useToken: true,
      method: "DELETE",
      url: baseUrl + "/product-order-history/rows/" + rowId,
    }),
});

import {
  ProductStockHistoryDTO,
  CreateProductStockHistoryDTO,
  UpdateProductStockHistoryDTO,
  ProductStockHistoryRowDTO,
  CreateProductStockHistoryRowDTO,
  UpdateProductStockHistoryRowDTO,
} from '@barbord/contract';
import { fetchWithSchema } from './lib/fetchWithSchema';

export const productStockHistoryGateway = (baseUrl: string) => ({
  get: () =>
    fetchWithSchema({
      useToken: true,
      method: 'GET',
      url: baseUrl + '/product-stock-history',
      responseSchema: ProductStockHistoryDTO,
    }),
  getRowsById: (historyId: number) =>
    fetchWithSchema({
      useToken: true,
      method: 'GET',
      url: baseUrl + '/product-stock-history/' + historyId + '/rows',
      responseSchema: ProductStockHistoryRowDTO,
    }),
  create: (body: CreateProductStockHistoryDTO) =>
    fetchWithSchema({
      useToken: true,
      method: 'POST',
      url: baseUrl + '/product-stock-history',
      body,
    }),
  update: (historyId: number, body: UpdateProductStockHistoryDTO) =>
    fetchWithSchema({
      useToken: true,
      method: 'PUT',
      url: baseUrl + '/product-stock-history/' + historyId,
      body,
    }),
  delete: (historyId: number) =>
    fetchWithSchema({
      useToken: true,
      method: 'DELETE',
      url: baseUrl + '/product-stock-history/' + historyId,
    }),
  createRow: (historyId: number, body: CreateProductStockHistoryRowDTO) =>
    fetchWithSchema({
      useToken: true,
      method: 'POST',
      url: baseUrl + '/product-stock-history/' + historyId + '/rows',
      body,
    }),
  updateRow: (rowId: number, body: UpdateProductStockHistoryRowDTO) =>
    fetchWithSchema({
      useToken: true,
      method: 'PUT',
      url: baseUrl + '/product-stock-history/rows/' + rowId,
      body,
    }),
  deleteRow: (rowId: number) =>
    fetchWithSchema({
      useToken: true,
      method: 'DELETE',
      url: baseUrl + '/product-stock-history/rows/' + rowId,
    }),
});
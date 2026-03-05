import { CreateProductDTO, UpdateProductDTO, ProductDTO, ProductStockDTO } from "@repo/contract";
import { fetchWithSchema } from "./lib/fetchWithSchema";

export const productsGateway = (baseUrl: string) => ({
  get: () =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/products",
      responseSchema: ProductDTO.array(),
    }),
  getAll: () =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/products/all",
      responseSchema: ProductDTO.array(),
    }),
  getArchived: () =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/products/archived",
      responseSchema: ProductDTO.array(),
    }),
  getById: (id: number) =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/products/" + id,
      responseSchema: ProductDTO,
    }),
  create: (body: CreateProductDTO) =>
    fetchWithSchema({
      useToken: true,
      method: "POST",
      url: baseUrl + "/products",
      body,
      bodySchema: CreateProductDTO,
      responseSchema: ProductDTO,
    }),
  update: (id: number, body: UpdateProductDTO) =>
    fetchWithSchema({
      useToken: true,
      method: "PUT",
      url: baseUrl + "/products/" + id,
      body,
      bodySchema: UpdateProductDTO,
      responseSchema: ProductDTO,
    }),
  archive: (id: number) =>
    fetchWithSchema({
      useToken: true,
      method: "POST",
      url: baseUrl + "/products/" + id + "/archive",
    }),
  unarchive: (id: number) =>
    fetchWithSchema({
      useToken: true,
      method: "POST",
      url: baseUrl + "/products/" + id + "/unarchive",
    }),
  stock: () =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/products/stock",
      responseSchema: ProductStockDTO.array(),
    }),
});

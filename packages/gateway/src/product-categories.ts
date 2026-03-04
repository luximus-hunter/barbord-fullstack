import {
  CreateProductCategoryDTO,
  UpdateProductCategoryDTO,
  ProductCategoryDTO,
} from "@repo/contract";
import { fetchWithSchema } from "./lib/fetchWithSchema";

export const productCategoriesGateway = (baseUrl: string) => ({
  get: () =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/product-categories",
      responseSchema: ProductCategoryDTO.array(),
    }),
  create: (body: CreateProductCategoryDTO) =>
    fetchWithSchema({
      useToken: true,
      method: "POST",
      url: baseUrl + "/product-categories",
      body,
      bodySchema: CreateProductCategoryDTO,
      responseSchema: ProductCategoryDTO,
    }),
  update: (id: number, body: UpdateProductCategoryDTO) =>
    fetchWithSchema({
      useToken: true,
      method: "PUT",
      url: baseUrl + "/product-categories/" + id,
      body,
      bodySchema: UpdateProductCategoryDTO,
      responseSchema: ProductCategoryDTO,
    }),
  delete: (id: number) =>
    fetchWithSchema({
      useToken: true,
      method: "DELETE",
      url: baseUrl + "/product-categories/" + id,
    }),
});

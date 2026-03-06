import { ProductImageDTO, CreateProductImageDTO } from "@barbord/contract";
import { fetchWithSchema } from "./lib/fetchWithSchema";

export const productImagesGateway = (baseUrl: string) => ({
  get: () =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/product-images",
      responseSchema: ProductImageDTO.array(),
      lsCache: {
        key: "product_images",
        staleTime: 1000 * 60 * 60 * 6, // 6 hours
      },
    }),
  create: (body: CreateProductImageDTO) =>
    fetchWithSchema({
      useToken: true,
      method: "POST",
      url: baseUrl + "/product-images",
      body,
      bodySchema: CreateProductImageDTO,
      responseSchema: ProductImageDTO,
      lsCache: {
        invalidateKeys: ["product_images"],
      },
    }),
  delete: (id: string) =>
    fetchWithSchema({
      useToken: true,
      method: "DELETE",
      url: baseUrl + "/product-images/" + id,
      lsCache: {
        invalidateKeys: ["product_images"],
      },
    }),
});

import { Item } from "@repo/db";
import { ProductDTO } from "@repo/contract";

export function toProductDTO(product: Item): ProductDTO {
  return ProductDTO.parse({
    ...product,
    price: product.price.toNumber(),
    salePrice: product.salePrice?.toNumber() || null,
  });
}

import { Item } from "@barbord/db";
import { ProductDTO } from "@barbord/contract";

export function toProductDTO(product: Item): ProductDTO {
  return ProductDTO.parse({
    ...product,
    price: product.price.toNumber(),
    salePrice: product.salePrice?.toNumber() || null,
  });
}

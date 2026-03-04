"use server";

import { db } from "@repo/db";
import { TypedResponse } from "@/lib/helpers";
import { authenticated } from "@/lib/auth/authenticated";
import { toProductDTO } from "@/mappers/product.mapper";
import { ProductDTO } from "@repo/contract/src/product";

export const GET = authenticated(async () => {
  const products = await db.item.findMany();

  return TypedResponse.json<ProductDTO[]>(products.map(toProductDTO));
});

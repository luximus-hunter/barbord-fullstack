"use server";

import { db } from "@repo/db";
import { ZodErrorResponse } from "@/lib/responses";
import { TypedResponse } from "@/lib/helpers";
import { authenticated } from "@/lib/auth/authenticated";
import { CreateProductDTO, ProductDTO } from "@repo/contract/src/product";
import { toProductDTO } from "@/mappers/product.mapper";

export const GET = authenticated(async () => {
  const products = await db.item.findMany({
    where: { archived: false },
  });

  return TypedResponse.json<ProductDTO[]>(products.map(toProductDTO));
});

export const POST = authenticated(async (request) => {
  const body = await request.json();
  const result = CreateProductDTO.safeParse(body);

  if (!result.success) return ZodErrorResponse(result);

  const product = await db.item.create({
    data: result.data,
  });

  return TypedResponse.json<ProductDTO>(toProductDTO(product));
});

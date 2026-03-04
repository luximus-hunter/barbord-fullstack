"use server";

import { db } from "@repo/db";
import { ZodErrorResponse } from "@/lib/responses";
import { TypedResponse } from "@/lib/helpers";
import { authenticated } from "@/lib/auth/authenticated";
import { ProductCategoryDTO, CreateProductCategoryDTO } from "@repo/contract";

export const GET = authenticated(async () => {
  const categories = await db.itemCategory.findMany();

  return TypedResponse.json<ProductCategoryDTO[]>(categories);
});

export const POST = authenticated(async (request) => {
  const body = await request.json();
  const result = CreateProductCategoryDTO.safeParse(body);

  if (!result.success) return ZodErrorResponse(result);

  const category = await db.itemCategory.create({
    data: result.data,
  });

  return TypedResponse.json<ProductCategoryDTO>(category);
});

"use server";

import { authenticated } from "@/lib/auth/authenticated";
import { TypedResponse } from "@/lib/helpers";
import {
  NotFoundResponse,
  SuccessResponse,
  ZodErrorResponse,
} from "@/lib/responses";
import { ProductCategoryDTO, UpdateProductCategoryDTO } from "@repo/contract";
import { db } from "@repo/db";
import { NextRequest } from "next/server";

export const PUT = authenticated(
  async (
    req: NextRequest,
    ctx: RouteContext<"/api/v1/product-categories/[id]">,
  ) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const body = await req.json();
    const result = UpdateProductCategoryDTO.safeParse(body);

    if (!result.success) return ZodErrorResponse(result);

    const productCategory = await db.itemCategory.findUnique({
      where: { id },
    });

    if (!productCategory)
      return NotFoundResponse(`Product category with id ${id} not found`);

    const updatedProductCategory = await db.itemCategory.update({
      where: { id },
      data: result.data,
    });

    return TypedResponse.json<ProductCategoryDTO>(updatedProductCategory);
  },
);

export const DELETE = authenticated(
  async (
    req: NextRequest,
    ctx: RouteContext<"/api/v1/product-categories/[id]">,
  ) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const productCategory = await db.itemCategory.findUnique({
      where: { id },
    });

    if (!productCategory)
      return NotFoundResponse(`Product category with id ${id} not found`);

    await db.itemCategory.delete({
      where: { id },
    });

    return SuccessResponse();
  },
);

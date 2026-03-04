"use server";

import { authenticated } from "@/lib/auth/authenticated";
import { TypedResponse } from "@/lib/helpers";
import { NotFoundResponse, ZodErrorResponse } from "@/lib/responses";
import { toProductDTO } from "@/mappers/product.mapper";
import { ProductDTO, UpdateProductDTO } from "@repo/contract/src/product";
import { db } from "@repo/db";
import { NextRequest } from "next/server";

export const GET = authenticated(
  async (_req: NextRequest, ctx: RouteContext<"/api/v1/products/[id]">) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const product = await db.item.findUnique({
      where: { id },
    });

    if (!product) return NotFoundResponse(`Product with id ${id} not found`);

    return TypedResponse.json<ProductDTO>(toProductDTO(product));
  },
);

export const PUT = authenticated(
  async (req: NextRequest, ctx: RouteContext<"/api/v1/products/[id]">) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const body = await req.json();
    const result = UpdateProductDTO.safeParse(body);

    if (!result.success) return ZodErrorResponse(result);

    const product = await db.item.findUnique({
      where: { id },
    });

    if (!product) return NotFoundResponse(`Product with id ${id} not found`);

    const updatedProduct = await db.item.update({
      where: { id },
      data: result.data,
    });

    return TypedResponse.json<ProductDTO>(toProductDTO(updatedProduct));
  },
);

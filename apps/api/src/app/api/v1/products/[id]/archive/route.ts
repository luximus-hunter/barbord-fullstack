import { authenticated } from "@/lib/auth/authenticated";
import { TypedResponse } from "@/lib/helpers";
import { NotFoundResponse } from "@/lib/responses";
import { toProductDTO } from "@/mappers/product.mapper";
import { ProductDTO } from "@repo/contract";
import { db } from "@repo/db";
import { NextRequest } from "next/server";

export const POST = authenticated(
  async (
    req: NextRequest,
    ctx: RouteContext<"/api/v1/products/[id]/archive">,
  ) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const product = await db.item.findUnique({
      where: { id },
    });

    if (!product) return NotFoundResponse(`Product with id ${id} not found`);

    const updatedProduct = await db.item.update({
      where: { id },
      data: { archived: true },
    });

    return TypedResponse.json<ProductDTO>(toProductDTO(updatedProduct));
  },
);

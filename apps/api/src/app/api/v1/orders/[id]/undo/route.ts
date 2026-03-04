import { authenticated } from "@/lib/auth/authenticated";
import { NotFoundResponse, SuccessResponse } from "@/lib/responses";
import { toOrderDTO } from "@/mappers/order.mapper";
import { db } from "@repo/db";
import { NextRequest } from "next/server";

export const POST = authenticated(
  async (req: NextRequest, ctx: RouteContext<"/api/v1/orders/[id]/undo">) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const order = await db.order.findUnique({
      where: { id },
    });

    if (!order) return NotFoundResponse(`Order with id ${id} not found`);
    const orderDTO = toOrderDTO(order);

    const orderTotal =
      orderDTO.productPrice * orderDTO.quantity + (orderDTO.fine || 0);

    await db.order.delete({
      where: { id },
    });

    await db.user.update({
      where: { id: order.userId },
      data: { saldo: { decrement: orderTotal } },
    });

    return SuccessResponse();
  },
);

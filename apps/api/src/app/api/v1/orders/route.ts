"use server";

import { db } from "@repo/db";
import { OrderDTO, CreateOrderDTO } from "@repo/contract";
import { NotFoundResponse, ZodErrorResponse } from "@/lib/responses";
import { TypedResponse } from "@/lib/helpers";
import { authenticated } from "@/lib/auth/authenticated";
import { toOrderDTO } from "@/mappers/order.mapper";
import { toSettingsDTO } from "@/mappers/settings.mapper";
import { toUserDTO } from "@/mappers/user.mapper";

export const POST = authenticated(async (request) => {
  const body = await request.json();
  const result = CreateOrderDTO.safeParse(body);

  if (!result.success) return ZodErrorResponse(result);

  const settingsEntries = await db.settingsV2.findMany();
  const settings = toSettingsDTO(settingsEntries);

  const order = await db.order.create({
    data: result.data,
  });

  const user = await db.user.findUnique({
    where: { id: result.data.userId },
  });

  if (!user)
    return NotFoundResponse(`User with id ${result.data.userId} not found`);
  const userDTO = toUserDTO(user);

  let orderTotal = result.data.productPrice * result.data.quantity;

  if (userDTO.saldo < settings.fineAt) {
    orderTotal += settings.fineAmount * result.data.quantity;
  }

  await db.user.update({
    where: { id: result.data.userId },
    data: { saldo: { decrement: orderTotal } },
  });

  return TypedResponse.json<OrderDTO>(toOrderDTO(order));
});

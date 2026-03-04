import { authenticated } from "@/lib/auth/authenticated";
import { TypedResponse } from "@/lib/helpers";
import { NotFoundResponse } from "@/lib/responses";
import { toUserDTO } from "@/mappers/user.mapper";
import { UserDTO } from "@repo/contract";
import { db } from "@repo/db";
import { NextRequest } from "next/server";

export const POST = authenticated(
  async (req: NextRequest, ctx: RouteContext<"/api/v1/users/[id]/archive">) => {
    const params = await ctx.params;
    const id = Number(params.id);

    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) return NotFoundResponse(`User with id ${id} not found`);

    const updatedUser = await db.user.update({
      where: { id },
      data: { archived: true },
    });

    return TypedResponse.json<UserDTO>(toUserDTO(updatedUser));
  },
);

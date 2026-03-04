import { authenticated } from "@/lib/auth/authenticated";
import { TypedResponse } from "@/lib/helpers";
import { AuthUserDTO } from "@repo/contract";
import type { NextRequest } from "next/server";

export const GET = authenticated(
  async (
    request: NextRequest,
    context: RouteContext<any>,
    admin: AuthUserDTO,
  ) => {
    return TypedResponse.json<AuthUserDTO>(admin);
  },
);

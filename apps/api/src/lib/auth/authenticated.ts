import type { NextRequest } from "next/server";
import { UnauthorizedResponse } from "../responses";
import { jwtVerify } from "jose";
import { AuthUserDTO } from "@repo/contract";

type AuthenticatedHandler = (
  request: NextRequest,
  context: RouteContext<any>,
  admin: AuthUserDTO,
) => Promise<Response>;

export function authenticated(handler: AuthenticatedHandler) {
  return async function (request: NextRequest, context: RouteContext<any>) {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return UnauthorizedResponse("No Bearer token provided");
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    const JWTSecret = new TextEncoder().encode(process.env.JWT_SECRET);
    const JWTResult = await jwtVerify(token, JWTSecret).catch(() => null);

    if (!JWTResult || !JWTResult.payload) {
      return UnauthorizedResponse("Invalid or expired JWT token");
    }

    const zodResult = AuthUserDTO.safeParse(JWTResult.payload);

    if (!zodResult.success) {
      return UnauthorizedResponse("Invalid JWT payload");
    }

    return handler(request, context, zodResult.data);
  };
}

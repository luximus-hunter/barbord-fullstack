import { verifyPassword } from "@/lib/auth/password";
import { TypedResponse } from "@/lib/helpers";
import { UnauthorizedResponse, ZodErrorResponse } from "@/lib/responses";
import { AuthUserDTO, LoginDTO } from "@repo/contract";
import { db } from "@repo/db";
import { SignJWT } from "jose";
import type { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const result = LoginDTO.safeParse(body);

  if (!result.success) return ZodErrorResponse(result);

  const { username, password } = result.data;

  const admin = await db.admin.findUnique({
    where: { username },
  });

  if (!admin) return UnauthorizedResponse("Invalid credentials");

  const valid = await verifyPassword(password, admin.password);
  if (!valid) return UnauthorizedResponse("Invalid credentials");

  const authUser: AuthUserDTO = {
    id: admin.id,
    username: admin.username,
    displayname: admin.displayname,
  };

  const JWTSecret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT(authUser)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(JWTSecret);

  return TypedResponse.json<AuthUserDTO>({
    ...authUser,
    token,
  });
};

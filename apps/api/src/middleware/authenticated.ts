import { AuthUserDTO } from "@repo/contract";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

type Env = {
  Variables: {
    authUser: AuthUserDTO;
  };
};

export const authenticated = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "No Bearer token provided" }, 401);
  }

  const token = authHeader.substring(7);

  try {
    const payload = await verify(token, process.env.JWT_SECRET || "", "HS256");
    const zodResult = AuthUserDTO.safeParse(payload);

    if (!zodResult.success) {
      console.error("Invalid JWT payload:", zodResult.error);
      return c.json({ error: "Invalid JWT payload" }, 401);
    }

    c.set("authUser", zodResult.data);
  } catch {
    return c.json({ error: "Invalid or expired JWT token" }, 401);
  }

  await next();
});

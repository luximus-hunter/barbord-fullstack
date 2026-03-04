import { ZodSafeParseResult } from "zod";

export function ZodErrorResponse(result: ZodSafeParseResult<any>) {
  return Response.json(
    {
      error: "Invalid request body",
      details: result.error,
    },
    { status: 400 },
  );
}

export function NotFoundResponse(message: string) {
  return Response.json(
    {
      error: "Not found",
      details: message,
    },
    { status: 404 },
  );
}

export function UnauthorizedResponse(message: string) {
  return Response.json(
    {
      error: "Unauthorized",
      details: message,
    },
    { status: 401 },
  );
}

export function SuccessResponse() {
  return Response.json(
    {
      success: true,
    },
    { status: 200 },
  );
}

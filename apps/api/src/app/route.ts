"use server";

import { NextRequest } from "next/server";
import { config } from "@/config";

// NOTE: This GET endpoint is intentionally left unauthenticated.
// This is so the client can fetch the API status.
export const GET = async (req: NextRequest) => {
  const uptime = process.uptime();

  // Format uptime to human-readable format
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  return Response.json({
    message: `API uptime: ${days}d ${hours}h ${minutes}m ${seconds}s`,
    version: config.version,
    url: req.url + `api/${config.version}`,
  });
};

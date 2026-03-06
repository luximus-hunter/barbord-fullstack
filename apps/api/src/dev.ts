import { serve } from "@hono/node-server";
import app from "./app";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

console.clear();
console.log(`Development server: http://localhost:${PORT}`);

serve({
  fetch: app.fetch,
  port: PORT,
});

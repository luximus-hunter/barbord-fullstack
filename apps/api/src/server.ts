import { serve } from "@hono/node-server";
import { createApp } from "./app";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const app = createApp();

console.clear();
console.log(`Server is running on http://localhost:${PORT}`);

serve({
  fetch: app.fetch,
  port: PORT,
});

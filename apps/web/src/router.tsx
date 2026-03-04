import { createRouter } from "@tanstack/solid-router";
import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
});

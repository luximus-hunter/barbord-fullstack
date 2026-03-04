import type { UseQueryResult } from "@tanstack/solid-query";
import { createEffect } from "solid-js";
import { router } from "../router";

export function useQueryRedirect(result: UseQueryResult) {
  createEffect(() => {
    if (result.error) {
      console.warn("Query error, redirecting to login", result.error);
      router.navigate({ to: "/login" });
    }
  });
}

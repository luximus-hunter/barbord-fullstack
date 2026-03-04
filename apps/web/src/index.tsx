import { render } from "solid-js/web";
import { RouterProvider } from "@tanstack/solid-router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { router } from "./router";
import "./index.css";

const queryClient = new QueryClient();

const root = document.getElementById("root");

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  ),
  root!,
);

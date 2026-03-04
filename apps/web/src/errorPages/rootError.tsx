import type { ErrorComponentProps } from "@tanstack/solid-router";
import { gatewayError } from "../gateway";

export function RootErrorPage({ error }: { error: ErrorComponentProps }) {
  if (gatewayError) {
    return (
      <div>
        <h1>Gateway Error</h1>
        <p>{gatewayError()?.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error.error.message}</p>
    </div>
  );
}

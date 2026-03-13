import { goto, invalidateAll } from "$app/navigation";
import { Gateway } from "@barbord/gateway";

export async function sveltekitLogout() {
  Gateway.auth.logout();
  await invalidateAll();
}

export async function sveltekitLogin() {
  await invalidateAll();
  setTimeout(() => goto("/backoffice"), 100);
}
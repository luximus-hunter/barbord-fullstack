import { createSignal } from "solid-js";
import { Gateway } from "@repo/gateway";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const [gateway, setGateway] = createSignal<Gateway>();
const [gatewayError, setGatewayError] = createSignal<Error>();

Gateway.prototype
  .initialize({
    baseApiUrl: apiUrl,
    version: "v1",
  })
  .then(setGateway)
  .catch(setGatewayError);

export { gateway, gatewayError };
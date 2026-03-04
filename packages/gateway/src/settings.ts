import { SettingsDTO } from "@repo/contract";
import { fetchWithSchema } from "./lib/fetchWithSchema";

export const settingsGateway = (baseUrl: string) => ({
  get: () =>
    fetchWithSchema({
      method: "GET",
      url: baseUrl + "/settings",
      responseSchema: SettingsDTO,
    }),
  set: (input: SettingsDTO) =>
    fetchWithSchema({
      useToken: true,
      method: "PUT",
      url: baseUrl + "/settings",
      body: input,
      bodySchema: SettingsDTO,
    }),
});

import {
  AutomaticTopupDTO,
  CreateAutomaticTopupDTO,
  UpdateAutomaticTopupDTO,
} from "@barbord/contract";
import { fetchWithSchema } from "./lib/fetchWithSchema";

export const automaticTopupsGateway = (baseUrl: string) => ({
  get: () =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/automatic-topups",
      responseSchema: AutomaticTopupDTO.array(),
    }),
  getById: (id: number) =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/automatic-topups/" + id,
      responseSchema: AutomaticTopupDTO,
    }),
  create: (body: CreateAutomaticTopupDTO) =>
    fetchWithSchema({
      useToken: true,
      method: "POST",
      url: baseUrl + "/automatic-topups",
      body,
      bodySchema: CreateAutomaticTopupDTO,
      responseSchema: AutomaticTopupDTO,
    }),
  update: (id: number, body: UpdateAutomaticTopupDTO) =>
    fetchWithSchema({
      useToken: true,
      method: "PUT",
      url: baseUrl + "/automatic-topups/" + id,
      body,
      bodySchema: UpdateAutomaticTopupDTO,
      responseSchema: AutomaticTopupDTO,
    }),
  delete: (id: number) =>
    fetchWithSchema({
      useToken: true,
      method: "DELETE",
      url: baseUrl + "/automatic-topups/" + id,
    }),
});

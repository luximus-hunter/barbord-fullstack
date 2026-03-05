import { TopupDTO, CreateTopupDTO } from "@barbord/contract";
import { fetchWithSchema } from "./lib/fetchWithSchema";

export const topupsGateway = (baseUrl: string) => ({
  get: () =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/topups",
      responseSchema: TopupDTO.array(),
    }),
  getPage: (page: number) =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/topups/page/" + page,
      responseSchema: TopupDTO.array(),
    }),
  getByUserId: (userId: number) =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/topups/user/" + userId,
      responseSchema: TopupDTO.array(),
    }),
  getPageByUserId: (page: number, userId: number) =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/topups/page/" + page + "/user/" + userId,
      responseSchema: TopupDTO.array(),
    }),
  createMany: (body: CreateTopupDTO[]) =>
    fetchWithSchema({
      useToken: true,
      method: "POST",
      url: baseUrl + "/topups",
      body: body,
      bodySchema: CreateTopupDTO.array(),
    }),
  undo: (id: number) =>
    fetchWithSchema({
      useToken: true,
      method: "POST",
      url: baseUrl + "/topups/" + id + "/undo",
    }),
  approve: (id: number) =>
    fetchWithSchema({
      useToken: true,
      method: "POST",
      url: baseUrl + "/topups/" + id + "/approve",
    }),
});

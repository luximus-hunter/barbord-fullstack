import { OrderDTO, CreateOrderDTO } from "@barbord/contract";
import { fetchWithSchema } from "./lib/fetchWithSchema";

export const ordersGateway = (baseUrl: string) => ({
  get: () =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/orders",
      responseSchema: OrderDTO.array(),
    }),
  getPage: (page: number) =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/orders/page/" + page,
      responseSchema: OrderDTO.array(),
    }),
  getByUserId: (userId: number) =>
    fetchWithSchema({
      method: "GET",
      url: baseUrl + "/orders/user/" + userId,
      responseSchema: OrderDTO.array(),
    }),
  getPageByUserId: (page: number, userId: number) =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/orders/page/" + page + "/user/" + userId,
      responseSchema: OrderDTO.array(),
    }),
  createMany: (body: CreateOrderDTO[]) =>
    fetchWithSchema({
      method: "POST",
      url: baseUrl + "/orders",
      body: body,
      bodySchema: CreateOrderDTO.array(),
    }),
  undo: (id: number) =>
    fetchWithSchema({
      useToken: true,
      method: "POST",
      url: baseUrl + "/orders/" + id + "/undo",
    }),
});

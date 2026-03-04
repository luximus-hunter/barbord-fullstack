import {
  AnnouncementDTO,
  CreateAnnouncementDTO,
  UpdateAnnouncementDTO,
} from "@repo/contract";
import { fetchWithSchema } from "./lib/fetchWithSchema";

export const announcementsGateway = (baseUrl: string) => ({
  get: () =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/announcements",
      responseSchema: AnnouncementDTO.array(),
    }),
  getById: (id: number) =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/announcements/" + id,
      responseSchema: AnnouncementDTO,
    }),
  create: (body: CreateAnnouncementDTO) =>
    fetchWithSchema({
      useToken: true,
      method: "POST",
      url: baseUrl + "/announcements",
      body,
      bodySchema: CreateAnnouncementDTO,
      responseSchema: AnnouncementDTO,
    }),
  update: (id: number, body: UpdateAnnouncementDTO) =>
    fetchWithSchema({
      useToken: true,
      method: "PUT",
      url: baseUrl + "/announcements/" + id,
      body,
      bodySchema: UpdateAnnouncementDTO,
      responseSchema: AnnouncementDTO,
    }),
  delete: (id: number) =>
    fetchWithSchema({
      useToken: true,
      method: "DELETE",
      url: baseUrl + "/announcements/" + id,
    }),
});

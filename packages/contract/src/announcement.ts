import { z } from "zod";
import { ColorEnum } from "./enums.js";

export const AnnouncementDTO = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string().max(1000),
  authorId: z.number(),
  color: z.enum(ColorEnum.options).nullable().default(null),
}).strict();

export const CreateAnnouncementDTO = AnnouncementDTO.pick({
  title: true,
  content: true,
  authorId: true,
  color: true,
}).strict();

export const UpdateAnnouncementDTO = AnnouncementDTO.pick({
  title: true,
  content: true,
  color: true,
}).partial().strict();

export type AnnouncementDTO = z.infer<typeof AnnouncementDTO>;
export type CreateAnnouncementDTO = z.infer<typeof CreateAnnouncementDTO>;
export type UpdateAnnouncementDTO = z.infer<typeof UpdateAnnouncementDTO>;

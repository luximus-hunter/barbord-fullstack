import { z } from "zod";
import { WeekdayEnum } from "./enums.js";

export const SettingsDTO = z
  .object({
    websiteTitle: z.string(),
    secondsPerAnnouncement: z.number().int(),
    itemsPerPage: z.number().int(),

    warnAt: z.number(),
    fineAt: z.number(),
    fineAmount: z.number(),

    mailAutoSend: z.boolean(),
    mailSendDay: z.enum(WeekdayEnum.options),
    mailSendInterval: z.number().int(),
    mailLastSent: z.string().nullable(), // ISO representation

    mailSubject: z.string(),
    mailBody: z.string(),
    mailFrom: z.string(),

    developers: z.array(z.number()),
  })
  .strict();

export const UpdateSettingsDTO = SettingsDTO.partial().strict();

export type SettingsDTO = z.infer<typeof SettingsDTO>;
export type UpdateSettingsDTO = z.infer<typeof UpdateSettingsDTO>;

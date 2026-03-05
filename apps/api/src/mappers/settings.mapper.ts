import { SettingsDTO } from "@barbord/contract";
import { SettingsV2 } from "@barbord/db";

export function toSettingsDTO(settingEntries: SettingsV2[]): SettingsDTO {
  const settingsObject = settingEntries.reduce(
    (acc, entry) => {
      acc[entry.key] = entry.value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return {
    websiteTitle: settingsObject["website_title"] || "Barbord",
    secondsPerAnnouncement: parseInt(
      settingsObject["seconds_per_announcement"] || "8",
      10,
    ),
    itemsPerPage: parseInt(settingsObject["items_per_page"] || "100", 10),

    warnAt: parseFloat(settingsObject["warn_at"] || "5"),
    fineAt: parseFloat(settingsObject["fine_at"] || "-10"),
    fineAmount: parseFloat(settingsObject["fine_amount"] || "0.50"),

    mailAutoSend: settingsObject["mail_auto_send"] === "true",
    mailSendDay: (settingsObject["mail_send_day"] ||
      "ma") as SettingsDTO["mailSendDay"],
    mailSendInterval: parseInt(settingsObject["mail_send_interval"] || "1", 10),
    mailLastSent: settingsObject["mail_last_sent"] || null,

    mailSubject: settingsObject["mail_subject"] || "",
    mailBody: settingsObject["mail_body"] || "",
    mailFrom: settingsObject["mail_from"] || "",

    developers: settingsObject["developers"]
      ? settingsObject["developers"]
          .split(",")
          .map((id) => parseInt(id.trim(), 10))
      : [],
  } satisfies SettingsDTO;
}

export function toSettingsV2Entries(settings: SettingsDTO): SettingsV2[] {
  return [
    { key: "website_title", value: settings.websiteTitle },
    {
      key: "seconds_per_announcement",
      value: settings.secondsPerAnnouncement.toString(),
    },
    { key: "items_per_page", value: settings.itemsPerPage.toString() },

    { key: "warn_at", value: settings.warnAt.toString() },
    { key: "fine_at", value: settings.fineAt.toString() },
    { key: "fine_amount", value: settings.fineAmount.toString() },

    { key: "mail_auto_send", value: settings.mailAutoSend.toString() },
    { key: "mail_send_day", value: settings.mailSendDay },
    { key: "mail_send_interval", value: settings.mailSendInterval.toString() },
    {
      key: "mail_last_sent",
      value: settings.mailLastSent ?? "",
    },

    { key: "mail_subject", value: settings.mailSubject },
    { key: "mail_body", value: settings.mailBody },
    { key: "mail_from", value: settings.mailFrom },

    { key: "developers", value: settings.developers.join(",") },
  ];
}

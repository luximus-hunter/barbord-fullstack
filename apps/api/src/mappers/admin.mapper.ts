import { AdminDTO } from "@barbord/contract";
import { Admin } from "@barbord/db";

export function toAdminDTO(admin: Admin): AdminDTO {
  return {
    id: admin.id,
    username: admin.username,
    displayname: admin.displayname,
    archived: admin.archived,
  };
}

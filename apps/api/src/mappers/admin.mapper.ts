import { AdminDTO } from "@repo/contract";
import { Admin } from "@repo/db";

export function toAdminDTO(admin: Admin): AdminDTO {
  return {
    id: admin.id,
    username: admin.username,
    displayname: admin.displayname,
    archived: admin.archived,
  };
}

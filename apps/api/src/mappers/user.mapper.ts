import { User } from "@repo/db";
import { UserDTO } from "@repo/contract";

export function toUserDTO(user: User): UserDTO {
  return UserDTO.parse({
    ...user,
    saldo: user.saldo.toNumber(),
    lastorder: user.lastorder?.toISOString() || null,
  });
}

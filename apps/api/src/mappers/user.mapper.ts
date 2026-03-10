import { User } from '@barbord/db';
import { UserDTO } from '@barbord/contract';

export function toUserDTO(user: User): UserDTO {
  return UserDTO.parse({
    ...user,
    saldo: user.saldo.toNumber(),
    lastorder: user.lastorder?.toISOString() || null,
  });
}
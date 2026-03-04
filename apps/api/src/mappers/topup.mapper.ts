import { TopupDTO } from "@repo/contract";
import { Topup } from "@repo/db";

export function toTopupDTO(topup: Topup): TopupDTO {
  return {
    ...topup,
    amount: topup.amount.toNumber(),
    oldSaldo: topup.oldSaldo.toNumber(),
    newSaldo: topup.newSaldo.toNumber(),
    date: topup.date.toISOString(),
  };
}

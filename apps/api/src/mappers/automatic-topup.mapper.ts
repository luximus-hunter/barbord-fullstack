import { AutomaticTopup } from "@repo/db";
import { AutomaticTopupDTO } from "@repo/contract";

export function toAutomaticTopupDTO(
  automaticTopup: AutomaticTopup,
): AutomaticTopupDTO {
  return AutomaticTopupDTO.parse({
    ...automaticTopup,
    amount: automaticTopup.amount.toNumber(),
    lastRun: automaticTopup.lastRun?.toISOString() || null,
  });
}

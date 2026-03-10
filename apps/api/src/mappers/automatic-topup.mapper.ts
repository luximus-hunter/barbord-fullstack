import { AutomaticTopup } from '@barbord/db';
import { AutomaticTopupDTO } from '@barbord/contract';

export function toAutomaticTopupDTO(
  automaticTopup: AutomaticTopup,
): AutomaticTopupDTO {
  return AutomaticTopupDTO.parse({
    ...automaticTopup,
    amount: automaticTopup.amount.toNumber(),
    lastRun: automaticTopup.lastRun?.toISOString() || null,
  });
}
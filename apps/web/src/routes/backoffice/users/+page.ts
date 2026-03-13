import { Gateway } from '@barbord/gateway';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  return {
    users: await Gateway.users.get(),
  };
};
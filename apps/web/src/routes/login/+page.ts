import { Gateway } from '@barbord/gateway';
import type { PageLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { LoginDTO } from '@barbord/contract';

export const load: PageLoad = async () => {
  const form = await superValidate(zod4(LoginDTO));
  return { form, admins: await Gateway.admins.get() };
};
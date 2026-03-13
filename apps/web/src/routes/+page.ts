import { Gateway } from '@barbord/gateway';
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent }) => {
  const { me, kioskMode } = await parent();

  if (!me && !kioskMode) {
    redirect(302, '/login');
  }

  return {
    shop: await Gateway.shop.getShopData(),
  };
};
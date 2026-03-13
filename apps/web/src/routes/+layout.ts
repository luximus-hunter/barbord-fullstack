// Ensure that all routes are only rendered client side.
// This app is statically generated.

import { Gateway } from '@barbord/gateway';
import type { LayoutLoad } from './$types';

export const prerender = false;
export const ssr = false;

export const load: LayoutLoad = async () => {
  let me = null;

  try {
    me = await Gateway.auth.me();
  } catch {}

  return {
    me,
    kioskMode: localStorage.getItem('kiosk-mode') === 'true',
    settings: await Gateway.settings.get(),
  };
};
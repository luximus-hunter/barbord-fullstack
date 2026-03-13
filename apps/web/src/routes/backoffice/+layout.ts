import type { LayoutLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import type { AuthUserDTO } from "@barbord/contract";

export const load: LayoutLoad = async ({ parent }) => {
  const data = await parent();
  const { me } = data;

  if (!me) {
    redirect(302, "/login");
  }

  return {
    ...data,
    me: me as AuthUserDTO
  }
};
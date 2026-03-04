import { AuthUserDTO, LoginDTO } from "@repo/contract";
import { fetchWithSchema, lsCachePrefix } from "./lib/fetchWithSchema";

export const authGateway = (baseUrl: string) => ({
  login: async (input: LoginDTO) => {
    const result = await fetchWithSchema({
      method: "POST",
      url: baseUrl + "/auth/login",
      body: input,
      bodySchema: LoginDTO,
      responseSchema: AuthUserDTO,
    });

    if (result?.token) {
      localStorage.setItem(lsCachePrefix + "token", result.token);
    }

    return result;
  },
  logout: () => {
    localStorage.removeItem(lsCachePrefix + "token");
  },
  me: () =>
    fetchWithSchema({
      useToken: true,
      method: "GET",
      url: baseUrl + "/auth/me",
      responseSchema: AuthUserDTO,
    }),
});

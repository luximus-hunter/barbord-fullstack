import { AuthUserDTO, LoginDTO } from '@barbord/contract';
import { fetchWithSchema, lsCachePrefix } from './lib/fetchWithSchema';

export const authGateway = (baseUrl: string) => ({
  login: async (input: LoginDTO) => {
    const result = await fetchWithSchema({
      method: 'POST',
      url: baseUrl + '/auth',
      body: input,
      bodySchema: LoginDTO,
      responseSchema: AuthUserDTO,
    });

    if (result?.token) {
      localStorage.setItem(lsCachePrefix + 'token', result.token);
    }

    return result;
  },
  logout: () => {
    localStorage.removeItem(lsCachePrefix + 'token');
    location.reload();
  },
  me: () =>
    fetchWithSchema({
      useToken: true,
      method: 'GET',
      url: baseUrl + '/auth',
      responseSchema: AuthUserDTO,
    }),
});
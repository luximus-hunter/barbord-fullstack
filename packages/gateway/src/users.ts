import { CreateUserDTO, UpdateUserDTO, UserDTO } from '@barbord/contract';
import { fetchWithSchema } from './lib/fetchWithSchema';

export const usersGateway = (baseUrl: string) => ({
  get: () =>
    fetchWithSchema({
      useToken: true,
      method: 'GET',
      url: baseUrl + '/users',
      responseSchema: UserDTO.array(),
    }),
  getAll: () =>
    fetchWithSchema({
      useToken: true,
      method: 'GET',
      url: baseUrl + '/users/all',
      responseSchema: UserDTO.array(),
    }),
  getArchived: () =>
    fetchWithSchema({
      useToken: true,
      method: 'GET',
      url: baseUrl + '/users/archived',
      responseSchema: UserDTO.array(),
    }),
  getById: (id: number) =>
    fetchWithSchema({
      useToken: true,
      method: 'GET',
      url: baseUrl + '/users/' + id,
      responseSchema: UserDTO,
    }),
  create: (body: CreateUserDTO) =>
    fetchWithSchema({
      useToken: true,
      method: 'POST',
      url: baseUrl + '/users',
      body,
      bodySchema: CreateUserDTO,
      responseSchema: UserDTO,
    }),
  update: (id: number, body: UpdateUserDTO) =>
    fetchWithSchema({
      useToken: true,
      method: 'PUT',
      url: baseUrl + '/users/' + id,
      body,
      bodySchema: UpdateUserDTO,
      responseSchema: UserDTO,
    }),
  archive: (id: number) =>
    fetchWithSchema({
      useToken: true,
      method: 'POST',
      url: baseUrl + '/users/' + id + '/archive',
    }),
  unarchive: (id: number) =>
    fetchWithSchema({
      useToken: true,
      method: 'POST',
      url: baseUrl + '/users/' + id + '/unarchive',
    }),
});
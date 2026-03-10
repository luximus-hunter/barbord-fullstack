import { AdminDTO, CreateAdminDTO, UpdateAdminDTO } from '@barbord/contract';
import { fetchWithSchema } from './lib/fetchWithSchema';

export const adminsGateway = (baseUrl: string) => ({
  get: () =>
    fetchWithSchema({
      method: 'GET',
      url: baseUrl + '/admins',
      responseSchema: AdminDTO.array(),
    }),
  getAll: () =>
    fetchWithSchema({
      useToken: true,
      method: 'GET',
      url: baseUrl + '/admins/all',
      responseSchema: AdminDTO.array(),
    }),
  getArchived: () =>
    fetchWithSchema({
      useToken: true,
      method: 'GET',
      url: baseUrl + '/admins/archived',
      responseSchema: AdminDTO.array(),
    }),
  getById: (id: number) =>
    fetchWithSchema({
      useToken: true,
      method: 'GET',
      url: baseUrl + '/admins/' + id,
      responseSchema: AdminDTO,
    }),
  create: (body: CreateAdminDTO) =>
    fetchWithSchema({
      useToken: true,
      method: 'POST',
      url: baseUrl + '/admins',
      body,
      bodySchema: CreateAdminDTO,
      responseSchema: AdminDTO,
    }),
  update: (id: number, body: UpdateAdminDTO) =>
    fetchWithSchema({
      useToken: true,
      method: 'PUT',
      url: baseUrl + '/admins/' + id,
      body,
      bodySchema: UpdateAdminDTO,
      responseSchema: AdminDTO,
    }),
  archive: (id: number) =>
    fetchWithSchema({
      useToken: true,
      method: 'POST',
      url: baseUrl + '/admins/' + id + '/archive',
    }),
  unarchive: (id: number) =>
    fetchWithSchema({
      useToken: true,
      method: 'POST',
      url: baseUrl + '/admins/' + id + '/unarchive',
    }),
});
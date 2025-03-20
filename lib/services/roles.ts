import { usersApi } from '../apis/users-api';
import {
  RoleAddPermissionBody,
  RoleCreateBody,
  RoleEditBody,
  RoleOperationResponse,
  RoleResponse,
  RolesListResponse,
} from '@/app/(private)/management/roles/schema/roles';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const userApi = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    listRoles: builder.query<RolesListResponse, void>({
      query: () => 'roles',
      providesTags: ['Role'],
    }),
    createRole: builder.mutation<RoleResponse, { body: RoleCreateBody }>({
      query: ({ body }) => ({
        url: 'roles',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Role'],
    }),
    retrieveRole: builder.query<RoleResponse, { id: string }>({
      query: ({ id }) => `roles/${id}`,
      providesTags: ['Role'],
    }),
    editRole: builder.mutation<RoleResponse, { id: string, body: RoleEditBody }>({
      query: ({ id, body }) => ({
        url: `roles/${id}`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: ['Role'],
    }),
    deleteRole: builder.mutation<RoleOperationResponse, { id: string }>({
      query: ({ id }) => ({
        url: `roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role'],
    }),
    roleAddPermission: builder.mutation<RoleResponse, { id: string, body: RoleAddPermissionBody }>({
      query: ({ id, body }) => ({
        url: `roles/${id}/permissions`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Role'],
    }),
    roleDeletePermission: builder.mutation<RoleOperationResponse, { id: string, permissionId: string }>({
      query: ({ id, permissionId }) => ({
        url: `roles/${id}/permissions/${permissionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role'],
    }),
  }),
});

export const {
  useListRolesQuery,
  useCreateRoleMutation,
  useRetrieveRoleQuery,
  useEditRoleMutation,
  useDeleteRoleMutation,
  useRoleAddPermissionMutation,
  useRoleDeletePermissionMutation,
} = userApi;
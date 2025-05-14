import { usersApi } from '../apis/users-api';
import {
  RoleAddPermissionBody,
  RoleCreateBody,
  RoleOperationResponse,
  RoleResponse,
  Roles,
  RolesListResponse,
  RoleUpdateBody,
} from '@/app/(private)/management/roles/schema/roles';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const userApi = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    listRoles: builder.query<RolesListResponse, { company_id: string }>({
      query: (params) => ({
        url: `roles`,
        method: 'GET',
        params: {
          company_id: Object.keys(params).includes('company_id') ? params.company_id : '',
        },
      }),
      providesTags: ['Role'],
    }),
    createRole: builder.mutation<RoleResponse, RoleCreateBody>({
      query: (body) => ({
        url: 'roles',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Role'],
    }),
    getRole: builder.query<Roles, string>({
      query: (id) => `roles/${id}`,
      transformResponse: (response: RoleResponse) => response.data,
      providesTags: ['Role'],
    }),
    updateRole: builder.mutation<
      RoleResponse,
      { id: string; body: RoleUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `roles/${id}`,
        method: 'PUT',
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
    roleAddPermission: builder.mutation<
      RoleResponse,
      { id: string; body: RoleAddPermissionBody }
    >({
      query: ({ id, body }) => ({
        url: `roles/${id}/permissions`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Role'],
    }),
    roleDeletePermission: builder.mutation<
      RoleOperationResponse,
      { id: string; permissionId: string }
    >({
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
  useLazyListRolesQuery,
  useCreateRoleMutation,
  useGetRoleQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useRoleAddPermissionMutation,
  useRoleDeletePermissionMutation,
} = userApi;

import { NewRole, NewRoleResponse, PermissionListResponse, RoleDetail, RoleDetailResponse, RoleListResponse } from '@/app/(private)/management/roles/schema/roles';
import { usersApi } from '../apis/users-api';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const userApi = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    listRoles: builder.query<RoleListResponse, { company_id?: string, name?: string } | void>({
      query: (params) => ({
        url: `roles`,
        method: 'GET',
        params: params ?? {},
      }),
      providesTags: ['Role'],
    }),
    createRole: builder.mutation<NewRoleResponse, Omit<NewRole, 'permissions'>>({
      query: (body) => ({
        url: 'roles',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Role'],
    }),
    getRole: builder.query<RoleDetail, string>({
      query: (id) => `roles/${id}`,
      transformResponse: (response: RoleDetailResponse) => response.data,
      providesTags: ['Role'],
    }),
    updateRole: builder.mutation<NewRoleResponse, { id: string; body: Partial<NewRole> }>({
      query: ({ id, body }) => ({
        url: `roles/${id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['Role'],
    }),

    listPermissions: builder.query<PermissionListResponse, { name?: string } | void>({
      query: (params) => ({
        url: `permissions`,
        method: 'GET',
        params: params ?? {},
      }),
      providesTags: ['Role'],
    }),

    addPermissionToRole: builder.mutation<NewRoleResponse, { role_id: string, permission_ids: string[] }>({
      query: (body) => ({
        url: `roles/${body.role_id}/permissions`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Role'],
    }),

    removePermissionFromRole: builder.mutation<NewRoleResponse, { role_id: string, permission_id: string }>({
      query: (body) => ({
        url: `roles/${body.role_id}/permissions/${body.permission_id}`,
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
  useListPermissionsQuery,
  useAddPermissionToRoleMutation,
  useRemovePermissionFromRoleMutation,
  useLazyListPermissionsQuery,
} = userApi;

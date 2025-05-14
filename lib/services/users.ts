import { usersApi } from '../apis/users-api';
import {
  UserCreateBody,
  UserListResponse,
  UserOperationResponse,
  UserResponse,
  Users,
  UserUpdateBody,
  UserUpdateRoleBody,
} from '@/app/(private)/management/users/schema/users';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const userApi = usersApi.injectEndpoints({  endpoints: (builder) => ({
    listUsers: builder.query<UserListResponse, { company_id?: string } | void>({
      query: (data) => ({
        url: `users`,
        params: data || {},
      }),
      providesTags: ['User'],
    }),
    createUser: builder.mutation<UserResponse, Partial<UserCreateBody>>({
      query: (body) => ({
        url: 'users',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['User'],
    }),
    getUser: builder.query<Users, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: UserResponse) => response.data,
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<
      UserResponse,
      { id: string; body: UserUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<UserOperationResponse, { id: string }>({
      query: ({ id }) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    updateUserRole: builder.mutation<
      UserResponse,
      { id: string; body: UserUpdateRoleBody }
    >({
      query: ({ id, body }) => ({
        url: `users/${id}/update-role`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useListUsersQuery,
  useLazyListUsersQuery,
  useCreateUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} = userApi;

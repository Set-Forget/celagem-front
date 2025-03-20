import { usersApi } from '../apis/users-api';
import {
  UserCreateBody,
  UserEditBody,
  UserEditRoleBody,
  UserListResponse,
  UserOperationResponse,
  UserResponse,
} from '@/app/(private)/management/users/schema/users';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const userApi = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    listUsers: builder.query<
      UserListResponse,
      { FirstName: string; LastName: string; CompanyId: string }
    >({
      query: (data) => ({
        url: `users`,
        params: data || {},
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    createUser: builder.mutation<UserResponse, { body: UserCreateBody }>({
      query: ({ body }) => ({
        url: 'users',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['User'],
    }),
    retrieveUser: builder.query<UserResponse, { id: string }>({
      query: ({ id }) => ({
        url: `users/${id}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    editUser: builder.mutation<
      UserResponse,
      { id: string; body: UserEditBody }
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
    editUserRole: builder.mutation<
      UserResponse,
      { id: string; body: UserEditRoleBody }
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
  useLazyListUsersQuery,
  useCreateUserMutation,
  useRetrieveUserQuery,
  useEditUserMutation,
  useDeleteUserMutation,
  useEditUserRoleMutation,
} = userApi;

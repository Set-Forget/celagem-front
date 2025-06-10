import { NewUser, NewUserResponse, UserDetail, UserDetailResponse } from '@/app/(private)/management/users/schema/users';
import { usersApi } from '../apis/users-api';
import { UserListResponse } from '../schemas/users';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const userApi = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    listUsers: builder.query<UserListResponse, { company_id?: string, name?: string } | void>({
      query: (data) => ({
        url: `users`,
        params: data || {},
      }),
      providesTags: ['User'],
    }),
    createUser: builder.mutation<NewUserResponse, Partial<NewUser>>({
      query: (body) => ({
        url: 'users',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['User'],
    }),
    getUser: builder.query<UserDetail, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: UserDetailResponse) => response.data,
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<NewUserResponse, { id: string; body: Partial<NewUser> }>({
      query: ({ id, body }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['User'],
    }),
    updateUserRole: builder.mutation<NewUserResponse, { id: string; body: { role_id: string } }>({
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
  useUpdateUserRoleMutation,
} = userApi;

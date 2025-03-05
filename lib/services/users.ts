import { usersApi } from '../apis/users-api';
import { ClassListResponse, UserListResponse } from '../schemas/users';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const userApi = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    listClasses: builder.query<ClassListResponse, void>({
      query: () => 'classes',
    }),
    listUsers: builder.query<UserListResponse, void>({
      query: () => 'users',
    }),
  }),
});

export const {
  useListClassesQuery,
  useLazyListUsersQuery
} = userApi;
import { usersApi } from '../apis/users-api';
import { ClassListResponse, CompaniesListResponse, UserListResponse } from '../schemas/users';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const userApi = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    listClasses: builder.query<ClassListResponse, void>({
      query: () => 'classes',
    }),
    listUsers: builder.query<UserListResponse, { name?: string } | void>({
      query: (data) => ({
        url: 'users',
        params: data || {}
      }),
    }),
    listCompanies: builder.query<CompaniesListResponse, { name?: string } | void>({
      query: (data) => ({
        url: 'companies',
        params: data || {}
      }),
    }),
  }),
});

export const {
  useListClassesQuery,
  useLazyListUsersQuery,
  useLazyListCompaniesQuery,
  useLazyListClassesQuery
} = userApi;
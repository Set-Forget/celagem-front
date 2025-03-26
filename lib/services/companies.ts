import { usersApi } from '../apis/users-api';
import {
  Companies,
  CompaniesListResponse,
  CompanyCreateBody,
  CompanyOperationResponse,
  CompanyResponse,
  CompanyUpdateBody,
} from '@/app/(private)/management/companies/schema/companies';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const companiesApi = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    listCompanies: builder.query<CompaniesListResponse, void>({
      query: () => 'companies',
    }),
    createCompany: builder.mutation<CompanyResponse, CompanyCreateBody>({
      query: (body) => ({
        url: 'companies',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Company'],
    }),
    getCompany: builder.query<Companies, string>({
      query: (id) => `companies/${id}`,
      transformResponse: (response: CompanyResponse) => response.data,
      providesTags: ['Company'],
    }),
    updateCompany: builder.mutation<
      CompanyResponse,
      { id: string; body: CompanyUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `companies/${id}`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: ['Company'],
    }),
    deleteCompany: builder.mutation<CompanyOperationResponse, { id: string }>({
      query: ({ id }) => ({
        url: `companies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Company'],
    }),
    companyAddUser: builder.mutation<CompanyOperationResponse, { id: string }>({
      query: ({ id }) => ({
        url: `companies/${id}/users`,
        method: 'POST',
      }),
      invalidatesTags: ['Company'],
    }),
    companyDeleteUser: builder.mutation<
      CompanyOperationResponse,
      { id: string; userId: string }
    >({
      query: ({ id, userId }) => ({
        url: `companies/${id}/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Company'],
    }),
  }),
});

export const {
  useListCompaniesQuery,
  useLazyListCompaniesQuery,
  useCreateCompanyMutation,
  useGetCompanyQuery,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useCompanyAddUserMutation,
  useCompanyDeleteUserMutation,
} = companiesApi;

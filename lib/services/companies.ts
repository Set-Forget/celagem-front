import { usersApi } from '../apis/users-api';
import {
  CompaniesListResponse,
  CompanyCreateBody,
  CompanyEditBody,
  CompanyOperationResponse,
  CompanyResponse,
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
    retrieveCompany: builder.query<CompanyResponse, { id: string }>({
      query: ({ id }) => `companies/${id}`,
      providesTags: ['Company'],
    }),
    editCompany: builder.mutation<CompanyResponse, { id: string, body: CompanyEditBody }>({
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
    companyDeleteUser: builder.mutation<CompanyOperationResponse, { id: string, userId: string }>({
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
  useCreateCompanyMutation,
  useRetrieveCompanyQuery,
  useEditCompanyMutation,
  useDeleteCompanyMutation,
  useCompanyAddUserMutation,
  useCompanyDeleteUserMutation,
} = companiesApi;
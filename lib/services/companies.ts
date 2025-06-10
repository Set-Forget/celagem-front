import { CompanyDetail, CompanyDetailResponse, CompanyListResponse, NewCompany, NewCompanyResponse } from '@/app/(private)/management/companies/schema/companies';
import { usersApi } from '../apis/users-api';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const companiesApi = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    listCompanies: builder.query<CompanyListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/companies',
        params: data || {},
      }),
    }),
    createCompany: builder.mutation<NewCompanyResponse, NewCompany>({
      query: (body) => ({
        url: '/companies',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Company'],
    }),
    getCompany: builder.query<CompanyDetail, string>({
      query: (id) => `/companies/${id}`,
      transformResponse: (response: CompanyDetailResponse) => response.data,
      providesTags: ['Company'],
    }),
    updateCompany: builder.mutation<NewCompanyResponse, { id: string; body: Partial<NewCompany> }>({
      query: ({ id, body }) => ({
        url: `/companies/${id}`,
        method: 'PUT',
        body: body,
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
} = companiesApi;

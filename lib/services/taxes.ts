import { erpApi } from '../apis/erp-api';
import {
  TaxCreateBody,
  TaxDeleteResponse,
  TaxResponse,
  TaxUpdateBody,
  Taxes,
} from '@/app/(private)/management/extras/taxes/schema/taxes';
import { TaxesListResponse } from '../schemas/taxes';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const taxesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listTaxes: builder.query<TaxesListResponse, { name?: string, type_tax_use: 'sale' | 'purchase' | 'both' } | void>({
      query: (data) => ({
        url: 'taxes',
        params: data || {},
      }),
    }),
    createTax: builder.mutation<TaxResponse, TaxCreateBody>({
      query: (body) => ({
        url: 'taxes',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Tax'],
    }),
    getTax: builder.query<Taxes, string>({
      query: (id) => `taxes/${id}`,
      transformResponse: (response: TaxResponse) => response.data,
      providesTags: ['Tax'],
    }),
    updateTax: builder.mutation<
      TaxResponse,
      { id: string; body: TaxUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `taxes/${id}`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: ['Tax'],
    }),
    deleteTax: builder.mutation<TaxDeleteResponse, { id: string }>({
      query: ({ id }) => ({
        url: `taxes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tax'],
    }),
  }),
});

export const {
  useListTaxesQuery,
  useLazyListTaxesQuery,
  useCreateTaxMutation,
  useGetTaxQuery,
  useUpdateTaxMutation,
  useDeleteTaxMutation,
} = taxesApi;

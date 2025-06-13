import { NewTax, NewTaxResponse, TaxDetail, TaxDetailResponse, TaxesListResponse } from '@/app/(private)/accounting/taxes/schema/taxes';
import { erpApi } from '../apis/erp-api';

export const taxesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listTaxes: builder.query<TaxesListResponse, { name?: string, type_tax_use: 'sale' | 'purchase' | 'both' } | void>({
      query: (data) => ({
        url: 'taxes',
        params: data || {},
      }),
      providesTags: ['Tax'],
    }),
    createTax: builder.mutation<NewTaxResponse, NewTax>({
      query: (body) => ({
        url: 'taxes',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Tax'],
    }),
    getTax: builder.query<TaxDetail, string | number>({
      query: (id) => `taxes/${id}`,
      transformResponse: (response: TaxDetailResponse) => response.data,
      providesTags: ['Tax'],
    }),
    updateTax: builder.mutation<TaxDetailResponse, { id: string; body: Partial<NewTax> }>({
      query: ({ id, body }) => ({
        url: `taxes/${id}`,
        method: 'PUT',
        body: body,
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
  useLazyGetTaxQuery,
  useUpdateTaxMutation,
} = taxesApi;

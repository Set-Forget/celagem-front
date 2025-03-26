import { erpApi } from '@/lib/apis/erp-api';
import { TaxesListResponse } from '../schemas/taxes';

export const taxesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listTaxes: builder.query<TaxesListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/taxes',
        params: data || {},
      }),
      providesTags: ['Tax'],
    }),
  }),
});

export const {
  useListTaxesQuery,
  useLazyListTaxesQuery
} = taxesApi;



import { erpApi } from '../apis/erp-api';
import { CurrencyDetail, CurrencyDetailResponse, CurrencyListResponse, NewCurrency, NewCurrencyResponse } from '@/app/(private)/accounting/currencies/schema/currencies';

export const currenciesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listCurrencies: builder.query<CurrencyListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/currencies',
        params: data || {},
      }),
      providesTags: ['Currency'],
    }),
    createCurrency: builder.mutation<NewCurrencyResponse, NewCurrency>({
      query: (body) => ({
        url: 'currencies',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Currency'],
    }),
    getCurrency: builder.query<CurrencyDetail, string | number>({
      query: (id) => `currencies/${id}`,
      transformResponse: (response: CurrencyDetailResponse) => response.data,
      providesTags: ['Currency'],
    }),
    updateCurrency: builder.mutation<NewCurrencyResponse, { id: string; body: Partial<NewCurrency> }>({
      query: ({ id, body }) => ({
        url: `currencies/${id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['Currency'],
    }),
  }),
});

export const {
  useListCurrenciesQuery,
  useLazyListCurrenciesQuery,
  useCreateCurrencyMutation,
  useGetCurrencyQuery,
  useLazyGetCurrencyQuery,
  useUpdateCurrencyMutation,
} = currenciesApi;

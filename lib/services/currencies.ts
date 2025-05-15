import { erpApi } from '../apis/erp-api';
import {
  CurrencyCreateBody,
  CurrenciesListResponse,
  CurrencyDeleteResponse,
  CurrencyResponse,
  CurrencyUpdateBody,
  Currencies,
} from '@/app/(private)/reporting/extras/currencies/schema/currencies';
import { CurrencyListResponse } from '../schemas/currencies';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const currenciesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listCurrencies: builder.query<CurrencyListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/currencies',
        params: data || {},
      }),
      providesTags: ['Currency'],
    }),
    createCurrency: builder.mutation<CurrencyResponse, CurrencyCreateBody>({
      query: (body) => ({
        url: 'currencies',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Currency'],
    }),
    getCurrency: builder.query<Currencies, string>({
      query: (id) => `currencies/${id}`,
      transformResponse: (response: CurrencyResponse) => response.data,
      providesTags: ['Currency'],
    }),
    updateCurrency: builder.mutation<
      CurrencyResponse,
      { id: string; body: CurrencyUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `currencies/${id}`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: ['Currency'],
    }),
    deleteCurrency: builder.mutation<CurrencyDeleteResponse, { id: string }>({
      query: ({ id }) => ({
        url: `currencies/${id}`,
        method: 'DELETE',
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
  useUpdateCurrencyMutation,
  useDeleteCurrencyMutation,
} = currenciesApi;

import { erpApi } from '@/lib/apis/erp-api';
import { CurrencyListResponse } from '../schemas/currencies';

export const currenciesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listCurrencies: builder.query<CurrencyListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/currencies',
        params: data || {},
      }),
      providesTags: ['Currency'],
    }),
  }),
});

export const {
  useLazyListCurrenciesQuery,
  useListCurrenciesQuery
} = currenciesApi;



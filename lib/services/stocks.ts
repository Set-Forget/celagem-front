import { erpApi } from '@/lib/apis/erp-api';
import { StockLocationListResponse } from '../schemas/stocks';

export const sotcksApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listStocks: builder.query<StockLocationListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/locations',
        params: data || {},
      }),
    }),
  }),
});

export const {
  useLazyListStocksQuery,
} = sotcksApi;



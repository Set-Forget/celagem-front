import { PurchaseReceiptDetail, PurchaseReceiptDetailResponse, PurchaseReceiptListResponse } from '@/app/purchases/purchase-receipts/schemas/purchase-receipts';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const purchaseReceiptsApi = createApi({
  reducerPath: 'purchaseReceiptsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `/erp/api/`,
    prepareHeaders(headers) {
      const token = ""
      if (token) {
        headers.set('authorization', `${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    listPurchaseReceipts: builder.query<PurchaseReceiptListResponse, void>({
      query: () => 'receptions',
    }),

    getPurchaseReceipt: builder.query<PurchaseReceiptDetail, string>({
      query: (id) => `/receptions/${id}`,
      transformResponse: (response: PurchaseReceiptDetailResponse) => response.data,
    }),
  }),
});

export const {
  useListPurchaseReceiptsQuery,
  useGetPurchaseReceiptQuery,
} = purchaseReceiptsApi;



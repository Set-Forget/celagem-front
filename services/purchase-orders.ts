import { PurchaseOrderDetail, PurchaseOrderDetailResponse, PurchaseOrderListResponse } from '@/app/purchases/purchase-orders/schemas/purchase-orders';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const purchaseOrdersApi = createApi({
  reducerPath: 'purchaseOrdersApi',
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
    listPurchaseOrders: builder.query<PurchaseOrderListResponse, void>({
      query: () => 'purchase_orders',
    }),
    getPurchaseOrder: builder.query<PurchaseOrderDetail, string>({
      query: (id) => `/purchase_orders/${id}`,
      transformResponse: (response: PurchaseOrderDetailResponse) => response.data,
    }),
  }),
});

export const {
  useListPurchaseOrdersQuery,
  useGetPurchaseOrderQuery,
} = purchaseOrdersApi;



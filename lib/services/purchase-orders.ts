import { PurchaseOrderDetail, PurchaseOrderDetailResponse, PurchaseOrderListResponse } from '@/app/(private)/purchases/purchase-orders/schemas/purchase-orders';
import { erpApi } from '@/lib/apis/erp-api';

export const purchaseOrdersApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listPurchaseOrders: builder.query<PurchaseOrderListResponse, { number?: string } | void>({
      query: (data) => ({
        url: '/purchase_orders',
        params: data || {},
      }),
      providesTags: ['PurchaseOrder'],
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
  useLazyListPurchaseOrdersQuery,
} = purchaseOrdersApi;



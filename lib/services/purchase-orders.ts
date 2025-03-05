import { PurchaseOrderDetail, PurchaseOrderDetailResponse, PurchaseOrderListResponse } from '@/app/purchases/purchase-orders/schemas/purchase-orders';
import { erpApi } from '@/lib/apis/erp-api';

export const purchaseOrdersApi = erpApi.injectEndpoints({
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



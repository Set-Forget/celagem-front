import { NewPurchaseOrder, NewPurchaseOrderResponse, PurchaseOrderDetail, PurchaseOrderDetailResponse, PurchaseOrderListResponse } from '@/app/(private)/purchases/purchase-orders/schemas/purchase-orders';
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
      providesTags: ['PurchaseOrder'],
    }),
    updatePurchaseOrder: builder.mutation<{ status: string, message: string }, Omit<Partial<PurchaseOrderDetail>, "status"> & { state: "draft" | "sent" | "to approve" | "purchase" | "done" | "cancel" }>({
      query: ({ id, ...data }) => ({
        url: `purchase_orders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PurchaseOrder'],
    }),
    createPurchaseOrder: builder.mutation<NewPurchaseOrderResponse, Omit<NewPurchaseOrder, 'currency' | 'payment_term' | 'required_date'> & { currency: number; payment_term: number; required_date: string }>({
      query: (data) => ({
        url: '/purchase_orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PurchaseOrder'],
    })
  }),
});

export const {
  useListPurchaseOrdersQuery,
  useGetPurchaseOrderQuery,
  useLazyListPurchaseOrdersQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderMutation,
} = purchaseOrdersApi;



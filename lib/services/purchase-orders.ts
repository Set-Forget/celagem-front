import { NewPurchaseOrder, NewPurchaseOrderResponse, PurchaseOrderDetail, PurchaseOrderDetailResponse, PurchaseOrderListResponse } from '@/app/(private)/purchases/purchase-orders/schemas/purchase-orders';
import { erpApi } from '@/lib/apis/erp-api';
import { Overwrite } from '../utils';

export const purchaseOrdersApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listPurchaseOrders: builder.query<PurchaseOrderListResponse,
      {
        number?: string,
        status?: "draft" | "sent" | "to approve" | "purchase" | "done" | "cancel",
        supplier?: string,
        created_at_start?: string,
        created_at_end?: string,
        required_date_start?: string,
        required_date_end?: string,
      } | void>({
        query: (data) => ({
          url: '/purchase_orders',
          params: data || {},
        }),
        providesTags: ['PurchaseOrder'],
      }),
    getPurchaseOrder: builder.query<PurchaseOrderDetail, string>({
      query: (id) => `/purchase_orders/${id}`,
      transformResponse: (response: PurchaseOrderDetailResponse) => response.data,
      providesTags: (result, error, id) => [{ type: 'PurchaseOrder', id }],
    }),
    updatePurchaseOrder: builder.mutation<{ status: string, message: string }, Omit<Partial<PurchaseOrderDetail>, "status"> & { state: "draft" | "sent" | "to approve" | "purchase" | "done" | "cancel" }>({
      query: ({ id, ...data }) => ({
        url: `purchase_orders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PurchaseOrder'],
    }),
    createPurchaseOrder: builder.mutation<NewPurchaseOrderResponse, Overwrite<Omit<NewPurchaseOrder, 'currency' | 'payment_term' | 'required_date'> & { currency: number; payment_term: number; required_date: string }, { company: number }>>({
      query: (data) => ({
        url: '/purchase_orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PurchaseOrder'],
    }),
    confirmPurchaseOrder: builder.mutation<{ status: string, message: string }, { id: string, purchaseRequestId?: number }>({
      query: ({ id }) => ({
        url: `/purchase_orders/${id}/to_approve`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { purchaseRequestId }) => purchaseRequestId
        ? [{ type: 'PurchaseOrder' }, { type: 'PurchaseRequest', id: purchaseRequestId }]
        : [{ type: 'PurchaseOrder' }]
    }),
    cancelPurchaseOrder: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/purchase_orders/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['PurchaseOrder'],
    }),
    approvePurchaseOrder: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/purchase_orders/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['PurchaseOrder'],
    }),
  }),
});

export const {
  useListPurchaseOrdersQuery,
  useGetPurchaseOrderQuery,
  useLazyListPurchaseOrdersQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderMutation,

  useConfirmPurchaseOrderMutation,
  useCancelPurchaseOrderMutation,
  useApprovePurchaseOrderMutation,
} = purchaseOrdersApi;



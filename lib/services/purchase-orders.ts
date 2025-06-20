import { NewPurchaseOrder, NewPurchaseOrderResponse, PurchaseOrderDetailResponse, PurchaseOrderListResponse, PurchaseOrderState } from '@/app/(private)/(commercial)/purchases/purchase-orders/schemas/purchase-orders';
import { erpApi } from '@/lib/apis/erp-api';
import { AdaptedPurchaseOrderDetail, AdaptedPurchaseOrderList, getPurchaseOrderAdapter, listPurchaseOrdersAdapter } from '../adapters/purchase-order';
import { Overwrite } from '../utils';

export const purchaseOrdersApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listPurchaseOrders: builder.query<
      AdaptedPurchaseOrderList[],
      {
        number?: string,
        status?: PurchaseOrderState,
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
        transformResponse: (response: PurchaseOrderListResponse) => response?.data?.map(listPurchaseOrdersAdapter) ?? [],
        providesTags: ['PurchaseOrder'],
      }),
    getPurchaseOrder: builder.query<AdaptedPurchaseOrderDetail, string | number>({
      query: (id) => `/purchase_orders/${id}`,
      transformResponse: (response: PurchaseOrderDetailResponse) => getPurchaseOrderAdapter(response.data),
      providesTags: ["PurchaseOrder"]
    }),
    updatePurchaseOrder: builder.mutation<{ status: string, message: string }, { body: Partial<Overwrite<Omit<NewPurchaseOrder, 'currency' | 'payment_term' | 'required_date'> & { currency: number; payment_term: number; required_date: string }, { company: number }>>, id: string | number }>({
      query: ({ id, body }) => ({
        url: `purchase_orders/${id}`,
        method: 'PUT',
        body: { ...body },
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
      invalidatesTags: ["PurchaseOrder"],
    }),
    cancelPurchaseOrder: builder.mutation<{ status: string, message: string }, { id: string, rejection_reason: string }>({
      query: ({ id, rejection_reason }) => ({
        url: `/purchase_orders/${id}/cancel`,
        body: { rejection_reason },
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
    resetPurchaseOrder: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/purchase_orders/${id}/reset_to_draft`,
        method: 'POST',
      }),
      invalidatesTags: ['PurchaseOrder'],
    }),
  }),
});

export const {
  useListPurchaseOrdersQuery,
  useGetPurchaseOrderQuery,
  useLazyGetPurchaseOrderQuery,
  useLazyListPurchaseOrdersQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderMutation,

  useConfirmPurchaseOrderMutation,
  useCancelPurchaseOrderMutation,
  useApprovePurchaseOrderMutation,
  useResetPurchaseOrderMutation,
} = purchaseOrdersApi;



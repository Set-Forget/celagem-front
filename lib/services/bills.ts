import { BillDetail, BillDetailResponse, BillListResponse, BillStatus, NewBill, NewBillResponse } from '@/app/(private)/purchases/bills/schemas/bills';
import { erpApi } from '@/lib/apis/erp-api';

export const billsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listBills: builder.query<BillListResponse,
      {
        number?: string,
        supplier?: string,
        status?: BillStatus,
        date_start?: string,
        date_end?: string,
        due_date_start?: string,
        due_date_end?: string,
      } | void>({
        query: (data) => ({
          url: '/purchase_invoices',
          params: data || {},
        }),
        providesTags: ['Bill'],
      }),
    getBill: builder.query<BillDetail, string>({
      query: (id) => `/purchase_invoices/${id}`,
      transformResponse: (response: BillDetailResponse) => response.data,
      providesTags: ['Bill'],
    }),
    createBill: builder.mutation<NewBillResponse, Omit<NewBill, 'cost_center' | 'notes' | 'accounting_account' | 'currency' | 'payment_term' | 'payment_method' | "accounting_date"> & { currency: number; payment_term: number, payment_method: number, accounting_date: string, purchase_order_id?: number }>({
      query: ({ purchase_order_id, ...bill }) => ({
        url: '/purchase_invoices',
        method: 'POST',
        body: bill,
      }),
      invalidatesTags: (result, error, { purchase_order_id }) => purchase_order_id
        ? [{ type: 'Bill' }, { type: 'PurchaseOrder', id: purchase_order_id }]
        : [{ type: 'Bill' }]
    }),
    updateBill: builder.mutation<{ status: string, message: string }, Omit<Partial<BillDetail>, 'status'> & { state: BillStatus }>({
      query: (bill) => ({
        url: `/purchase_invoices/${bill.id}`,
        method: 'PUT',
        body: bill,
      }),
      invalidatesTags: ['Bill'],
    }),
    deleteBill: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/purchase_invoices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bill'],
    }),

    confirmBill: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/purchase_invoices/${id}/to_approve`,
        method: 'POST',
      }),
      invalidatesTags: ['Bill'],
    }),
    approveBill: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/purchase_invoices/${id}/post`,
        method: 'POST',
      }),
      invalidatesTags: ['Bill'],
    }),
    cancelBill: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/purchase_invoices/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Bill'],
    }),
  }),
});

export const {
  useListBillsQuery,
  useLazyListBillsQuery,
  useGetBillQuery,
  useLazyGetBillQuery,
  useCreateBillMutation,
  useUpdateBillMutation,
  useDeleteBillMutation,

  useConfirmBillMutation,
  useApproveBillMutation,
  useCancelBillMutation,
} = billsApi;



import { BillDetailResponse, BillListResponse, BillStatus, BillTypes, NewBill, NewBillResponse } from '@/app/(private)/(commercial)/purchases/bills/schemas/bills';
import { erpApi } from '@/lib/apis/erp-api';
import { AdaptedBillDetail, AdaptedBillList, getBillAdapter, listBillsAdapter } from '../adapters/bills';

export const billsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listBills: builder.query<AdaptedBillList[],
      {
        number?: string,
        supplier?: string,
        status?: BillStatus,
        date_start?: string,
        date_end?: string,
        due_date_start?: string,
        due_date_end?: string,
        type?: BillTypes
      } | void>({
        query: (data) => ({
          url: '/purchase_invoices',
          params: data || {},
        }),
        transformResponse: (response: BillListResponse) => response.data.map(listBillsAdapter),
        providesTags: ['Bill'],
      }),
    getBill: builder.query<AdaptedBillDetail, string | number>({
      query: (id) => `/purchase_invoices/${id}`,
      transformResponse: (response: BillDetailResponse) => getBillAdapter(response.data),
      providesTags: ['Bill'],
    }),
    createBill: builder.mutation<NewBillResponse, Omit<NewBill, 'cost_center' | 'notes' | 'accounting_account' | 'currency' | 'payment_term' | 'payment_method' | "accounting_date" | "date"> & { currency: number; payment_term: number, payment_method: number, accounting_date: string, date: string, purchase_order_id?: number }>({
      query: ({ purchase_order_id, ...bill }) => ({
        url: '/purchase_invoices',
        method: 'POST',
        body: bill,
      }),
      invalidatesTags: [
        'Bill',
        'AccountsPayable',
        'JournalEntry',
        'AccountingAccount',
        'PurchaseOrder',
      ]
    }),
    updateBill: builder.mutation<{ status: string, message: string }, { body: Omit<Partial<NewBill>, "accounting_date" | "date"> & { accounting_date: string, date: string }, id: string | number }>({
      query: ({ body, id }) => ({
        url: `/purchase_invoices/${id}`,
        method: 'PUT',
        body: { ...body },
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
    cancelBill: builder.mutation<{ status: string, message: string }, { id: string, rejection_reason: string }>({
      query: ({ id, rejection_reason }) => ({
        url: `/purchase_invoices/${id}/cancel`,
        body: { rejection_reason },
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



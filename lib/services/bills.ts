import { BillDetail, BillDetailResponse, BillListResponse, NewBill, NewBillResponse } from '@/app/purchases/bills/schemas/bills';
import { erpApi } from '@/lib/apis/erp-api';

export const billsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listBills: builder.query<BillListResponse, void>({
      query: () => 'purchase_invoices',
      providesTags: ['Bill'],
    }),
    getBill: builder.query<BillDetail, string>({
      query: (id) => `/purchase_invoices/${id}`,
      transformResponse: (response: BillDetailResponse) => response.data,
      providesTags: ['Bill'],
    }),
    createBill: builder.mutation<NewBillResponse, Omit<NewBill, 'cost_center' | 'notes' | 'accounting_account' | 'currency' | 'payment_term'> & { currency: number; payment_term: number }>({
      query: (bill) => ({
        url: '/purchase_invoices',
        method: 'POST',
        body: bill,
      }),
      invalidatesTags: ['Bill'],
    }),
    updateBill: builder.mutation<{ status: string, message: string }, Partial<BillDetail>>({
      query: (bill) => ({
        url: `/purchase_invoices/${bill.id}`,
        method: 'PUT',
        body: bill,
      }),
      invalidatesTags: ['Bill'],
    }),
    deleteBill: builder.mutation<{ status: string, message: string }, number>({
      query: (id) => ({
        url: `/purchase_invoices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bill'],
    }),
  }),
});

export const {
  useListBillsQuery,
  useGetBillQuery,
  useCreateBillMutation,
  useUpdateBillMutation,
  useDeleteBillMutation,
} = billsApi;



import { InvoiceDetail, InvoiceDetailResponse, InvoiceListResponse, NewInvoice, NewInvoiceResponse } from '@/app/(private)/sales/invoices/schemas/invoices';
import { erpApi } from '@/lib/apis/erp-api';
import { Overwrite } from '../utils';

export const invoicesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listInvoices: builder.query
      <InvoiceListResponse,
        {
          number?: string,
          status?: "draft" | "posted" | "cancel",
          type?: "invoice" | "credit_note" | "debit_note",
          date_start?: string,
          date_end?: string,
          due_date_start?: string,
          due_date_end?: string,
        } | void
      >({
        query: (data) => ({
          url: '/sales_invoices',
          params: data || {},
        }),
        providesTags: ['Invoice'],
      }),
    getInvoice: builder.query<InvoiceDetail, string>({
      query: (id) => `sales_invoices/${id}`,
      transformResponse: (response: InvoiceDetailResponse) => response.data,
      providesTags: ['Invoice'],
    }),
    createInvoice: builder.mutation<NewInvoiceResponse, Omit<Overwrite<NewInvoice, { accounting_date: string, payment_method: number, items: { product_id: number, taxes_id: number[] | undefined, quantity: number }[] }>, 'cost_center' | 'accounting_account'>>({
      query: (invoice) => ({
        url: '/sales_invoices',
        method: 'POST',
        body: invoice,
      }),
      invalidatesTags: ['Invoice'],
    }),
    updateInvoice: builder.mutation<{ status: string, message: string }, Partial<Omit<InvoiceDetail, 'status'> & { state: 'draft' | 'posted' | 'cancel' }>>({
      query: ({ id, ...invoice }) => ({
        url: `/sales_invoices/${id}`,
        method: 'PUT',
        body: invoice,
      }),
      invalidatesTags: ['Invoice'],
    }),
    deleteInvoice: builder.mutation<{ status: string, message: string }, number>({
      query: (id) => ({
        url: `/sales_invoices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Invoice'],
    }),
  }),
});

export const {
  useListInvoicesQuery,
  useLazyListInvoicesQuery,
  useGetInvoiceQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
} = invoicesApi;
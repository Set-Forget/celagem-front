import { InvoiceDetail, InvoiceDetailResponse, InvoiceListResponse, NewInvoice, NewInvoiceResponse } from '@/app/(private)/sales/invoices/schemas/invoices';
import { erpApi } from '@/lib/apis/erp-api';

export const invoicesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listInvoices: builder.query<InvoiceListResponse, void>({
      query: () => 'sales_invoices',
      providesTags: ['Invoice'],
    }),
    getInvoice: builder.query<InvoiceDetail, string>({
      query: (id) => `sales_invoices/${id}`,
      transformResponse: (response: InvoiceDetailResponse) => response.data,
      providesTags: ['Invoice'],
    }),
    createInvoice: builder.mutation<NewInvoiceResponse, Omit<NewInvoice, 'cost_center' | 'notes' | 'accounting_account' | 'currency' | 'payment_term'> & { currency: number; payment_term: number }>({
      query: (invoice) => ({
        url: '/sales_invoices',
        method: 'POST',
        body: invoice,
      }),
      invalidatesTags: ['Invoice'],
    }),
    updateInvoice: builder.mutation<{ status: string, message: string }, Partial<InvoiceDetail>>({
      query: (invoice) => ({
        url: `/sales_invoices/${invoice.id}`,
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
  useGetInvoiceQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
} = invoicesApi;
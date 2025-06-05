import { InvoiceDetail, InvoiceDetailResponse, InvoiceListResponse, InvoiceStatus, InvoiceTypes, NewInvoice, NewInvoiceResponse } from '@/app/(private)/(commercial)/sales/invoices/schemas/invoices';
import { erpApi } from '@/lib/apis/erp-api';
import { Overwrite } from '../utils';
import { AdaptedInvoiceDetail, AdaptedInvoiceList, getInvoiceAdapter, listInvoicesAdapter } from '../adapters/invoices';

export const invoicesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listInvoices: builder.query
      <AdaptedInvoiceList[], {
        number?: string,
        status?: InvoiceStatus,
        type?: InvoiceTypes,
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
        transformResponse: (response: InvoiceListResponse) => response.data.map(listInvoicesAdapter),
        providesTags: ['Invoice'],
      }),
    getInvoice: builder.query<AdaptedInvoiceDetail, string | number>({
      query: (id) => `sales_invoices/${id}`,
      transformResponse: (response: InvoiceDetailResponse) => getInvoiceAdapter(response.data),
      providesTags: ['Invoice'],
    }),
    createInvoice: builder.mutation<NewInvoiceResponse, Overwrite<NewInvoice, { accounting_date: string, date: string, payment_method: number, items: { product_id: number, taxes_id?: number[], quantity: number }[] }>>({
      query: (invoice) => ({
        url: '/sales_invoices',
        method: 'POST',
        body: invoice,
      }),
      invalidatesTags: [
        'Invoice',
        'AccountsReceivable',
        'JournalEntry',
        'AccountingAccount'
      ]
    }),
    updateInvoice: builder.mutation<{ status: string, message: string }, { body: Partial<Overwrite<NewInvoice, { accounting_date: string, date: string, payment_method: number, items: { product_id: number, taxes_id?: number[], quantity: number }[] }>>, id: string | number }>({
      query: ({ body, id }) => ({
        url: `/sales_invoices/${id}`,
        method: 'PUT',
        body: { ...body },
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

    confirmInvoice: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/sales_invoices/${id}/to_approve`,
        method: 'POST',
      }),
      invalidatesTags: ['Invoice'],
    }),
    approveInvoice: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/sales_invoices/${id}/post`,
        method: 'POST',
      }),
      invalidatesTags: ['Invoice'],
    }),
    cancelInvoice: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/sales_invoices/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Invoice'],
    }),
  }),
});

export const {
  useListInvoicesQuery,
  useLazyListInvoicesQuery,
  useGetInvoiceQuery,
  useLazyGetInvoiceQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,

  useConfirmInvoiceMutation,
  useApproveInvoiceMutation,
  useCancelInvoiceMutation,
} = invoicesApi;
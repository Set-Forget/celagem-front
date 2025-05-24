import { DebitNoteDetail, DebitNoteDetailResponse, NewDebitNote, NewDebitNoteResponse } from '@/app/(private)/[scope]/debit-notes/schemas/debit-notes';
import { erpApi } from '@/lib/apis/erp-api';
import { Overwrite } from '../utils';
import { getDebitNoteAdapter } from '../adapters/debit-notes';

export const debitNotesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    getDebitNote: builder.query<DebitNoteDetail, string>({
      query: (id) => `debit_notes/${id}`,
      transformResponse: (response: DebitNoteDetailResponse) => getDebitNoteAdapter(response.data),
      providesTags: ['DebitNote'],
    }),
    createDebitNote: builder.mutation<NewDebitNoteResponse, Overwrite<Omit<NewDebitNote, 'items'> & { items: { product_id: number, taxes_id?: number[], quantity: number }[] }, { accounting_date: string, date: string }>>({
      query: (data) => ({
        url: 'debit_notes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DebitNote'],
    }),
    updateDebitNote: builder.mutation<{ status: string, message: string }, { body: Overwrite<Omit<NewDebitNote, 'items'> & { items: { product_id: number, taxes_id?: number[], quantity: number }[] }, { accounting_date: string, date: string }>, id: number | string }>({
      query: ({ body, id }) => ({
        url: `/debit_notes/${id}`,
        method: 'PUT',
        body: { ...body },
      }),
      invalidatesTags: ['DebitNote'],
    }),

    confirmDebitNote: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/debit_notes/${id}/post`,
        method: 'POST',
      }),
      invalidatesTags: ['DebitNote'],
    }),
    cancelDebitNote: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/debit_notes/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['DebitNote'],
    }),
  }),
});

export const {
  useGetDebitNoteQuery,
  useCreateDebitNoteMutation,
  useUpdateDebitNoteMutation,
  useConfirmDebitNoteMutation,
  useCancelDebitNoteMutation,
} = debitNotesApi;
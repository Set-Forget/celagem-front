import { DebitNoteDetail, DebitNoteDetailResponse, NewDebitNote, NewDebitNoteResponse } from '@/app/(private)/sales/debit-notes/schemas/debit-notes';
import { erpApi } from '@/lib/apis/erp-api';
import { Overwrite } from '../utils';

export const debitNotesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    getDebitNote: builder.query<DebitNoteDetail, string>({
      query: (id) => `debit_notes/${id}`,
      transformResponse: (response: DebitNoteDetailResponse) => response.data,
      providesTags: ['DebitNote'],
    }),
    createDebitNote: builder.mutation<NewDebitNoteResponse, Overwrite<Omit<NewDebitNote, 'items'> & { items: { product_id: number, taxes_id: number[] | undefined, quantity: number }[] }, { payment_method: number }>>({
      query: (data) => ({
        url: 'debit_notes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DebitNote'],
    }),
    updateDebitNote: builder.mutation<{ status: string, message: string }, Partial<Omit<DebitNoteDetail, 'status'> & { state: 'draft' | 'posted' | 'cancel' }>>({
      query: ({ id, ...data }) => ({
        url: `/debit_notes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['DebitNote'],
    }),
  }),
});

export const {
  useGetDebitNoteQuery,
  useCreateDebitNoteMutation,
  useUpdateDebitNoteMutation,
} = debitNotesApi;
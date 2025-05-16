import { CreditNoteDetail, CreditNoteDetailResponse, NewCreditNote, NewCreditNoteResponse } from '@/app/(private)/credit-notes/schemas/credit-notes';
import { erpApi } from '@/lib/apis/erp-api';

export const creditNotesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    getCreditNote: builder.query<CreditNoteDetail, string>({
      query: (id) => `credit_notes/${id}`,
      transformResponse: (response: CreditNoteDetailResponse) => response.data,
      providesTags: ['CreditNote'],
    }),
    createCreditNote: builder.mutation<NewCreditNoteResponse, Omit<NewCreditNote, 'items'> & { items: { product_id: number, taxes_id: number[] | undefined, quantity: number }[] }>({
      query: (data) => ({
        url: 'credit_notes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CreditNote'],
    }),
    updateCreditNote: builder.mutation<{ status: string, message: string }, Partial<Omit<CreditNoteDetail, 'status'> & { state: 'draft' | 'posted' | 'cancel' }>>({
      query: ({ id, ...data }) => ({
        url: `/credit_notes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['CreditNote'],
    }),

    confirmCreditNote: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/credit_notes/${id}/post`,
        method: 'POST',
      }),
      invalidatesTags: ['CreditNote'],
    }),
    cancelCreditNote: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/credit_notes/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['CreditNote'],
    }),
  }),
});

export const {
  useGetCreditNoteQuery,
  useCreateCreditNoteMutation,
  useUpdateCreditNoteMutation,
  useConfirmCreditNoteMutation,
  useCancelCreditNoteMutation,
} = creditNotesApi;
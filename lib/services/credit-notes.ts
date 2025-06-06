import { CreditNoteDetailResponse, NewCreditNote, NewCreditNoteResponse } from '@/app/(private)/(commercial)/[scope]/credit-notes/schemas/credit-notes';
import { erpApi } from '@/lib/apis/erp-api';
import { AdaptedCreditNoteDetail, getCreditNoteAdapter } from '../adapters/credit-notes';

export const creditNotesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    getCreditNote: builder.query<AdaptedCreditNoteDetail, string>({
      query: (id) => `credit_notes/${id}`,
      transformResponse: (response: CreditNoteDetailResponse) => getCreditNoteAdapter(response.data),
      providesTags: ['CreditNote'],
    }),
    createCreditNote: builder.mutation<NewCreditNoteResponse, Omit<NewCreditNote, "accounting_date" | "date"> & { accounting_date: string, date: string }>({
      query: (data) => ({
        url: 'credit_notes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CreditNote'],
    }),
    updateCreditNote: builder.mutation<{ status: string, message: string }, { body: Partial<Omit<NewCreditNote, "accounting_date" | "date"> & { accounting_date: string, date: string }>, id: string | number }>({
      query: ({ id, body }) => ({
        url: `/credit_notes/${id}`,
        method: 'PUT',
        body: { ...body },
      }),
      invalidatesTags: ['CreditNote'],
    }),

    confirmCreditNote: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/credit_notes/${id}/post`,
        method: 'POST',
      }),
      invalidatesTags: [
        'CreditNote',
        'Invoice',
        'Bill',
      ],
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
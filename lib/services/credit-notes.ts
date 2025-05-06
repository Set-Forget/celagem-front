import { CreditNoteDetail, CreditNoteDetailResponse, NewCreditNote, NewCreditNoteResponse } from '@/app/(private)/sales/credit-notes/schemas/credit-notes';
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
  }),
});

export const {
  useGetCreditNoteQuery,
  useCreateCreditNoteMutation,
  useUpdateCreditNoteMutation,
} = creditNotesApi;
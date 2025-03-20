import { CreditNoteDetail, CreditNoteDetailResponse, CreditNotesListResponse, NewCreditNote, NewCreditNoteResponse } from '@/app/(private)/sales/credit-notes/schemas/credit-notes';
import { erpApi } from '@/lib/apis/erp-api';

export const creditNotesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listCreditNotes: builder.query<CreditNotesListResponse, void>({
      query: () => 'credit_notes',
      providesTags: ['CreditNote'],
    }),
    getCreditNote: builder.query<CreditNoteDetail, string>({
      query: (id) => `credit_notes/${id}`,
      transformResponse: (response: CreditNoteDetailResponse) => response.data,
      providesTags: ['CreditNote'],
    }),
    createCreditNote: builder.mutation<NewCreditNoteResponse, NewCreditNote>({
      query: (data) => ({
        url: 'credit_notes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CreditNote'],
    }),
  }),
});

export const {
  useListCreditNotesQuery,
  useGetCreditNoteQuery,
  useCreateCreditNoteMutation,
} = creditNotesApi;
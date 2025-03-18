import { DebitNoteDetail, DebitNoteDetailResponse, DebitNotesListResponse, NewDebitNote, NewDebitNoteResponse } from '@/app/(private)/sales/debit-notes/schemas/debit-notes';
import { erpApi } from '@/lib/apis/erp-api';

export const debitNotesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listDebitNotes: builder.query<DebitNotesListResponse, void>({
      query: () => 'debit_notes',
      providesTags: ['DebitNote'],
    }),
    getDebitNote: builder.query<DebitNoteDetail, string>({
      query: (id) => `debit_notes/${id}`,
      transformResponse: (response: DebitNoteDetailResponse) => response.data,
      providesTags: ['DebitNote'],
    }),
    createDebitNote: builder.mutation<NewDebitNoteResponse, NewDebitNote>({
      query: (data) => ({
        url: 'debit_notes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DebitNote'],
    }),
  }),
});

export const {
  useListDebitNotesQuery,
  useGetDebitNoteQuery,
  useCreateDebitNoteMutation,
} = debitNotesApi;
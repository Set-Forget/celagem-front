import { JournalEntryDetail, JournalEntryDetailResponse, JournalEntryListResponse, JournalEntryStatus, NewJournalEntry, NewJournalEntryResponse } from '@/app/(private)/accounting/journal-entries/schemas/journal-entries';
import { erpApi } from '@/lib/apis/erp-api';
import { Overwrite } from '../utils';

export const journalEntriesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listJournalEntries: builder.query<JournalEntryListResponse,
      {
        number?: string
        state?: JournalEntryStatus,
        date_start?: string,
        date_end?: string,
      } | void>({
        query: (data) => ({
          url: 'account_entries',
          params: data ?? {},
        }),
        providesTags: ['JournalEntry'],
      }),
    getJournalEntry: builder.query<JournalEntryDetail, string>({
      query: (id) => `account_entries/${id}`,
      transformResponse: (response: JournalEntryDetailResponse) => response.data,
      providesTags: ['JournalEntry'],
    }),
    createJournalEntry: builder.mutation<NewJournalEntryResponse, Overwrite<NewJournalEntry, { date: string }>>({
      query: (body) => ({
        url: 'account_entries',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['JournalEntry'],
    }),
    updateJournalEntry: builder.mutation<{ status: string, message: string }, Overwrite<Partial<JournalEntryDetail>, { state: 'draft' | 'posted' }>>({
      query: ({ id, ...body }) => ({
        url: `account_entries/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['JournalEntry'],
    }),
    deleteJournalEntry: builder.mutation<{ status: string, message: string }, number>({
      query: (id) => ({
        url: `account_entries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['JournalEntry'],
    }),

    confirmJournalEntry: builder.mutation<{ status: string, message: string }, string>({
      query: (id) => ({
        url: `account_entries/${id}/post`,
        method: 'POST',
      }),
      invalidatesTags: ['JournalEntry'],
    }),
    cancelJournalEntry: builder.mutation<{ status: string, message: string }, string>({
      query: (id) => ({
        url: `account_entries/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['JournalEntry'],
    }),
  }),
});

export const {
  useListJournalEntriesQuery,
  useGetJournalEntryQuery,
  useCreateJournalEntryMutation,
  useUpdateJournalEntryMutation,
  useDeleteJournalEntryMutation,
  useConfirmJournalEntryMutation,
  useCancelJournalEntryMutation,
} = journalEntriesApi;



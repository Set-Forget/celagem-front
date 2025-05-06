import { JournalEntryDetail, JournalEntryDetailResponse, JournalEntryListResponse, NewJournalEntry, NewJournalEntryResponse } from '@/app/(private)/accounting/journal-entries/schemas/journal-entries';
import { erpApi } from '@/lib/apis/erp-api';
import { Overwrite } from '../utils';

export const journalEntriesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listJournalEntries: builder.query<JournalEntryListResponse, { name?: string } | void>({
      query: () => 'account_entries',
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
  }),
});

export const {
  useListJournalEntriesQuery,
  useGetJournalEntryQuery,
  useCreateJournalEntryMutation,
  useUpdateJournalEntryMutation,
  useDeleteJournalEntryMutation,
} = journalEntriesApi;



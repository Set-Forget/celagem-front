import { JournalListResponse, NewJournal, NewJournalResponse } from '@/app/(private)/accounting/journals/schema/journals';
import { erpApi } from '@/lib/apis/erp-api';

export const journalsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listJournals: builder.query<JournalListResponse, { name?: string } | void>({
      query: () => 'journals',
      providesTags: ['Journal'],
    }),
    createJournal: builder.mutation<NewJournalResponse, NewJournal>({
      query: (data) => ({
        url: 'journals',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Journal'],
    }),
  }),
});

export const {
  useListJournalsQuery,
  useLazyListJournalsQuery,
  useCreateJournalMutation,
} = journalsApi;
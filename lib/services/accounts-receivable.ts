import { AccountsReceivableListResponse } from '@/app/(private)/accounting/accounts-receivable/schemas/accounts-receivable';
import { erpApi } from '@/lib/apis/erp-api';

export const accountsReceivableApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listAccountsReceivable: builder.query<AccountsReceivableListResponse, { name?: string } | void>({
      query: () => 'accounts_receivable',
      providesTags: ['AccountsReceivable'],
    }),
  }),
});

export const {
  useListAccountsReceivableQuery
} = accountsReceivableApi;



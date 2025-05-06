import { AccountingAccountListResponse } from '@/app/(private)/accounting/chart-of-accounts/schemas/accounting-account';
import { erpApi } from '@/lib/apis/erp-api';

export const accountingAccountsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listAccountingAccounts: builder.query<AccountingAccountListResponse, { name?: string } | void>({
      query: () => 'accounts',
      providesTags: ['AccountingAccount'],
    }),
  }),
});

export const {
  useListAccountingAccountsQuery,
  useLazyListAccountingAccountsQuery
} = accountingAccountsApi;
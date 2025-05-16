import { AccountDetail, AccountDetailResponse, AccountListResponse, AccountMoveLineResponse, AccountTypes, NewAccount, NewAccountResponse } from '@/app/(private)/accounting/chart-of-accounts/schemas/account';
import { erpApi } from '@/lib/apis/erp-api';

export const accountingAccountsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listAccountingAccounts: builder.query<AccountListResponse, { name?: string, account_type?: AccountTypes, parent?: string } | void>({
      query: (data) => ({
        url: '/accounts',
        params: data || {},
      }),
      providesTags: ['AccountingAccount'],
    }),
    listAccountingAccountMoveLines: builder.query<AccountMoveLineResponse, string>({
      query: (id) => `accounts/${id}/move_lines`,
      providesTags: ['AccountingAccount'],
    }),
    getAccountingAccount: builder.query<AccountDetail, string>({
      query: (id) => `accounts/${id}`,
      transformResponse: (response: AccountDetailResponse) => response.data,
      providesTags: ['AccountingAccount'],
    }),
    createAccountingAccount: builder.mutation<NewAccountResponse, NewAccount>({
      query: (data) => ({
        url: 'accounts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AccountingAccount'],
    }),
  }),
});

export const {
  useListAccountingAccountsQuery,
  useListAccountingAccountMoveLinesQuery,
  useLazyListAccountingAccountsQuery,
  useGetAccountingAccountQuery,
  useLazyGetAccountingAccountQuery,
  useCreateAccountingAccountMutation,
} = accountingAccountsApi;
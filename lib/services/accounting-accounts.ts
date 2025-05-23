import { AccountDetail, AccountDetailResponse, AccountListResponse, AccountMoveLineResponse, NewAccount, NewAccountResponse } from '@/app/(private)/accounting/chart-of-accounts/schemas/account';
import { erpApi } from '@/lib/apis/erp-api';

export const accountingAccountsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listAccountingAccounts: builder.query<AccountListResponse, { name?: string, account_type?: string, parent?: string } | void>({
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
    updateAccountingAccount: builder.mutation<{ status: string, message: string }, { id: string, body: Partial<NewAccount> }>({
      query: ({ id, body }) => ({
        url: `accounts/${id}`,
        method: 'PUT',
        body: { ...body },
      }),
      invalidatesTags: ['AccountingAccount'],
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
  useUpdateAccountingAccountMutation,
} = accountingAccountsApi;
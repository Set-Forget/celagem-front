import { AccountsPayableListResponse } from '@/app/(private)/reporting/accounts-payable/schemas/accounts-payable';
import { erpApi } from '@/lib/apis/erp-api';

export const accountsPayableApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listAccountsPayable: builder.query<AccountsPayableListResponse, { name?: string } | void>({
      query: () => 'accounts_payable',
      providesTags: ['AccountsPayable'],
    }),
  }),
});

export const {
  useListAccountsPayableQuery,
  useLazyListAccountsPayableQuery
} = accountsPayableApi;



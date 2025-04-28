import { PaymentListResponse } from '@/app/(private)/banking/payments/schemas/payments';
import { erpApi } from '@/lib/apis/erp-api';

export const paymentsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listPayments: builder.query<PaymentListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/payments',
        params: data || {},
      }),
      providesTags: ['Payment'],
    }),
  }),
});

export const {
  useListPaymentsQuery,
  useLazyListPaymentsQuery
} = paymentsApi;
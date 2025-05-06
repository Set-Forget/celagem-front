import { erpApi } from '@/lib/apis/erp-api';
import { PaymentTermListResponse } from '../schemas/payment-terms';

export const paymentTermsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listPaymentTerms: builder.query<PaymentTermListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/payment_terms',
        params: data || {},
      }),
      providesTags: ['PaymentTerm'],
    }),
  }),
});

export const {
  useListPaymentTermsQuery,
  useLazyListPaymentTermsQuery
} = paymentTermsApi;



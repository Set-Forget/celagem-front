import { erpApi } from '@/lib/apis/erp-api';
import { PaymentMethodListResponse } from '../schemas/payment-methods';

export const paymentMethodsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listPaymentMethods: builder.query<PaymentMethodListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/custom_payment_methods',
        params: data || {},
      }),
      providesTags: ['PaymentMethod'],
    }),
  }),
});

export const {
  useListPaymentMethodsQuery,
  useLazyListPaymentMethodsQuery,
} = paymentMethodsApi;



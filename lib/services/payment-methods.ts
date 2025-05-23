import { erpApi } from '@/lib/apis/erp-api';
import { PaymentMethodListResponse } from '../schemas/payment-methods';

export const paymentMethodsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listPaymentMethods: builder.query<PaymentMethodListResponse, { name?: string, payment_type: "inbound" | "outbound" } | void>({
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



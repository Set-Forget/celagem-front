import { erpApi } from '@/lib/apis/erp-api';
import { PaymentMethodDetail, PaymentMethodDetailResponse, PaymentMethodListResponse } from '../schemas/payment-methods';

export const paymentMethodsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listPaymentMethods: builder.query<PaymentMethodListResponse, { name?: string, payment_type: "inbound" | "outbound" } | void>({
      query: (data) => ({
        url: '/custom_payment_methods',
        params: data || {},
      }),
      providesTags: ['PaymentMethod'],
    }),
    getPaymentMethod: builder.query<PaymentMethodDetail, string | number>({
      query: (id) => `custom_payment_methods/${id}`,
      transformResponse: (response: PaymentMethodDetailResponse) => response.data,
      providesTags: ['PaymentMethod'],
    }),
  }),
});

export const {
  useListPaymentMethodsQuery,
  useLazyListPaymentMethodsQuery,
  useGetPaymentMethodQuery,
  useLazyGetPaymentMethodQuery,
} = paymentMethodsApi;



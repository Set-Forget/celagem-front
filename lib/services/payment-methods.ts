import { NewPaymentMethod, NewPaymentMethodResponse, PaymentMethodDetail, PaymentMethodDetailResponse, PaymentMethodListResponse } from '@/app/(private)/accounting/payment-methods/schema/payment-methods';
import { erpApi } from '@/lib/apis/erp-api';

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
    createPaymentMethod: builder.mutation<NewPaymentMethodResponse, NewPaymentMethod>({
      query: (data) => ({
        url: '/custom_payment_methods',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PaymentMethod'],
    }),
    updatePaymentMethod: builder.mutation<PaymentMethodDetailResponse, { id: string | number, body: Partial<NewPaymentMethod> }>({
      query: ({ id, body }) => ({
        url: `/custom_payment_methods/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['PaymentMethod'],
    }),
  }),
});

export const {
  useListPaymentMethodsQuery,
  useLazyListPaymentMethodsQuery,
  useGetPaymentMethodQuery,
  useLazyGetPaymentMethodQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
} = paymentMethodsApi;



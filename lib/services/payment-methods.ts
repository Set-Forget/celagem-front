import { NewPaymentMethod, NewPaymentMethodResponse, PaymentMethodDetail, PaymentMethodDetailResponse, PaymentMethodLineDetail, PaymentMethodLineDetailResponse, PaymentMethodLineListResponse } from '@/app/(private)/accounting/payment-methods/schema/payment-methods';
import { erpApi } from '@/lib/apis/erp-api';

export const paymentMethodsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listPaymentMethodLines: builder.query<PaymentMethodLineListResponse, { name?: string, payment_type: "inbound" | "outbound" } | void>({
      query: (data) => ({
        url: '/payment_lines',
        params: data || {},
      }),
      providesTags: ['PaymentMethod'],
    }),
    getPaymentMethodLine: builder.query<PaymentMethodLineDetail, string | number>({
      query: (id) => `payment_lines/${id}`,
      transformResponse: (response: PaymentMethodLineDetailResponse) => response.data,
      providesTags: ['PaymentMethod'],
    }),
    createPaymentMethod: builder.mutation<NewPaymentMethodResponse, Omit<NewPaymentMethod, 'company' | 'payment_account'>>({
      query: (data) => ({
        url: '/payment_methods',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PaymentMethod'],
    }),
    getPaymentMethod: builder.query<PaymentMethodDetail, string | number>({
      query: (id) => `payment_methods/${id}`,
      transformResponse: (response: PaymentMethodDetailResponse) => response.data,
      providesTags: ['PaymentMethod'],
    }),
    updatePaymentMethod: builder.mutation<PaymentMethodLineDetailResponse, { id: string | number, body: Partial<NewPaymentMethod> }>({
      query: ({ id, body }) => ({
        url: `/payment_methods/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['PaymentMethod'],
    }),

    createPaymentMethodLine: builder.mutation<NewPaymentMethodResponse, { payment_method: string | number, company: string | number, payment_account: string | number }>({
      query: (data) => ({
        url: '/payment_lines',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PaymentMethod'],
    }),
    updatePaymentMethodLine: builder.mutation<NewPaymentMethodResponse, { id: string | number, body: Partial<{ payment_method: string | number, company: string | number, payment_account: string | number }> }>({
      query: ({ id, body }) => ({
        url: `/payment_lines/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['PaymentMethod'],
    }),
  }),
});

export const {
  useListPaymentMethodLinesQuery,
  useLazyListPaymentMethodLinesQuery,
  useGetPaymentMethodLineQuery,
  useLazyGetPaymentMethodLineQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useCreatePaymentMethodLineMutation,
  useUpdatePaymentMethodLineMutation,
  useGetPaymentMethodQuery,
  useLazyGetPaymentMethodQuery,
} = paymentMethodsApi;



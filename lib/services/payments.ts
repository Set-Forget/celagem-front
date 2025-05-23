import { NewPayment, NewPaymentResponse, PaymentDetail, PaymentDetailResponse, PaymentListResponse } from '@/app/(private)/banking/payments/schemas/payments';
import { erpApi } from '@/lib/apis/erp-api';
import { Overwrite } from '../utils';

export const paymentsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listPayments: builder.query<PaymentListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/payments',
        params: data || {},
      }),
      providesTags: ['Payment'],
    }),
    getPayment: builder.query<PaymentDetail, number | string>({
      query: (id) => ({
        url: `/payments/${id}`,
      }),
      transformResponse: (response: PaymentDetailResponse) => response.data,
      providesTags: ['Payment'],
    }),
    createPayment: builder.mutation<NewPaymentResponse, Overwrite<NewPayment, { date: string }>>({
      query: (data) => ({
        url: '/payments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment', 'Bill'],
    }),

    confirmPayment: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/payments/${id}/confirm`,
        method: 'POST',
      }),
      invalidatesTags: ['Payment', 'Bill'],
    }),
    cancelPayment: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/payments/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Payment'],
    }),
  }),
});

export const {
  useListPaymentsQuery,
  useLazyListPaymentsQuery,
  useCreatePaymentMutation,
  useGetPaymentQuery,

  useConfirmPaymentMutation,
  useCancelPaymentMutation,
} = paymentsApi;
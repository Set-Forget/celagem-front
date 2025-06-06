import {
  PaymentTermCreateBody,
  PaymentTermDeleteResponse,
  PaymentTermResponse,
  PaymentTermUpdateBody,
  PaymentTerms
} from '@/app/(private)/management/extras/payment-terms/schema/payment-terms';
import { erpApi } from '@/lib/apis/erp-api';
import { PaymentTermListResponse } from '../schemas/payment-terms';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const paymentTermsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listPaymentTerms: builder.query<PaymentTermListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/payment_terms',
        params: data || {},
      }),
      providesTags: ['PaymentTerm'],
    }),
    createPaymentTerm: builder.mutation<PaymentTermResponse, PaymentTermCreateBody>({
      query: (body) => ({
        url: 'payment_terms',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['PaymentTerm'],
    }),
    getPaymentTerm: builder.query<PaymentTerms, string | number>({
      query: (id) => `payment_terms/${id}`,
      transformResponse: (response: PaymentTermResponse) => response.data,
      providesTags: ['PaymentTerm'],
    }),
    updatePaymentTerm: builder.mutation<
      PaymentTermResponse,
      { id: string; body: PaymentTermUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `payment_terms/${id}`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: ['PaymentTerm'],
    }),
    deletePaymentTerm: builder.mutation<PaymentTermDeleteResponse, { id: string }>({
      query: ({ id }) => ({
        url: `payment_terms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PaymentTerm'],
    }),
  }),
});

export const {
  useListPaymentTermsQuery,
  useLazyListPaymentTermsQuery,
  useCreatePaymentTermMutation,
  useGetPaymentTermQuery,
  useUpdatePaymentTermMutation,
  useDeletePaymentTermMutation,
} = paymentTermsApi;

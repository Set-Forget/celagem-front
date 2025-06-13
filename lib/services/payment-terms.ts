import { PaymentTermDetailsResponse, PaymentTermDetails, PaymentTermListResponse } from "@/app/(private)/accounting/payment-terms/schema/payment-terms";
import { erpApi } from "../apis/erp-api";

export const paymentTermsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listPaymentTerms: builder.query<PaymentTermListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/payment_terms',
        params: data || {},
      }),
      providesTags: ['PaymentTerm'],
    }),
    createPaymentTerm: builder.mutation<any, any>({
      query: (body) => ({
        url: 'payment_terms',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['PaymentTerm'],
    }),
    getPaymentTerm: builder.query<PaymentTermDetails, string | number>({
      query: (id) => `payment_terms/${id}`,
      transformResponse: (response: PaymentTermDetailsResponse) => response.data,
      providesTags: ['PaymentTerm'],
    }),
    updatePaymentTerm: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `payment_terms/${id}`,
        method: 'PUT',
        body: body,
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
} = paymentTermsApi;

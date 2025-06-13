import { PaymentTermDetailsResponse, PaymentTermDetails, PaymentTermListResponse, NewPaymentTerm, NewPaymentTermResponse } from "@/app/(private)/accounting/payment-terms/schema/payment-terms";
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
    createPaymentTerm: builder.mutation<NewPaymentTermResponse, NewPaymentTerm>({
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
    updatePaymentTerm: builder.mutation<PaymentTermDetailsResponse, { id: string; body: Partial<NewPaymentTerm> }>({
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

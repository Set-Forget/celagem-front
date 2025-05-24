import { erpApi } from '@/lib/apis/erp-api';
import { Overwrite } from '../utils';
import { ChargeDetail, ChargeDetailResponse, ChargeListResponse, NewCharge, NewChargeResponse } from '@/app/(private)/banking/receipts/schemas/receipts';

export const chargesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listCharges: builder.query<ChargeListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/charges',
        params: data || {},
      }),
      providesTags: ['Charge'],
    }),
    getCharge: builder.query<ChargeDetail, number | string>({
      query: (id) => ({
        url: `/charges/${id}`,
      }),
      transformResponse: (response: ChargeDetailResponse) => response.data,
      providesTags: ['Charge'],
    }),
    createCharge: builder.mutation<NewChargeResponse, Overwrite<NewCharge, { date: string, invoices?: number[] }>>({
      query: (data) => ({
        url: '/charges',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Charge', 'Bill'],
    }),

    confirmCharge: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/charges/${id}/confirm`,
        method: 'POST',
      }),
      invalidatesTags: ['Charge', 'Bill'],
    }),
    cancelCharge: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/charges/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Charge'],
    }),
  }),
});

export const {
  useListChargesQuery,
  useLazyListChargesQuery,
  useCreateChargeMutation,
  useGetChargeQuery,

  useConfirmChargeMutation,
  useCancelChargeMutation,
} = chargesApi;
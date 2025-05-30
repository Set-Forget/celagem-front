import { DeliveryNoteDetail, DeliveryNoteDetailResponse, DeliveryNoteListResponse, NewDeliveryNote, NewDeliveryNoteResponse } from '@/app/(private)/(commercial)/sales/delivery-notes/schemas/delivery-notes';
import { erpApi } from '@/lib/apis/erp-api';
import { Overwrite } from '../utils';

export const deliveriesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listDeliveries: builder.query<DeliveryNoteListResponse, {
      received_at_start?: string,
      received_at_end?: string,
      number?: string,
    } | void>({
      query: (data) => ({
        url: 'deliveries',
        params: data || {},
      }),
      providesTags: ['DeliveryNote'],
    }),
    createDelivery: builder.mutation<NewDeliveryNoteResponse, Overwrite<NewDeliveryNote, { delivery_date: string }>>({
      query: (data) => ({
        url: 'deliveries',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DeliveryNote'],
    }),
    getDelivery: builder.query<DeliveryNoteDetail, string>({
      query: (id) => `deliveries/${id}`,
      transformResponse: (response: DeliveryNoteDetailResponse) => response.data,
      providesTags: ['DeliveryNote'],
    }),
  }),
});

export const {
  useListDeliveriesQuery,
  useCreateDeliveryMutation,
  useGetDeliveryQuery,
} = deliveriesApi;



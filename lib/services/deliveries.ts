import { DeliveryNoteListResponse } from '@/app/(private)/sales/delivery-notes/schemas/delivery-notes';
import { erpApi } from '@/lib/apis/erp-api';

export const deliveriesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listDeliveries: builder.query<DeliveryNoteListResponse, void>({
      query: () => 'deliveries',
    }),
  }),
});

export const {
  useListDeliveriesQuery,
} = deliveriesApi;



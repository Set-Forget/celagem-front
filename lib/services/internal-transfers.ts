import { erpApi } from '../apis/erp-api';
import {
  InternalTransferCreateBody,
  InternalTransfersListResponse,
  InternalTransferDeleteResponse,
  InternalTransferResponse,
  InternalTransferUpdateBody,
  InternalTransfers,
} from '@/app/(private)/inventory/internal-transfers/schema/internal-transfers';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const internalTransfersApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listInternalTransfers: builder.query<InternalTransfersListResponse, void>({
      query: (data) => ({
        url: 'internal_transfers',
      }),
    }),
    createInternalTransfer: builder.mutation<
      InternalTransferResponse,
      InternalTransferCreateBody
    >({
      query: (body) => ({
        url: 'internal_transfers',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['InternalTransfer'],
    }),
    getInternalTransfer: builder.query<InternalTransfers, string>({
      query: (id) => `internal_transfers/${id}`,
      transformResponse: (response: InternalTransferResponse) => response.data,
      providesTags: ['InternalTransfer'],
    }),
    updateInternalTransfer: builder.mutation<
      InternalTransferResponse,
      { id: string; body: InternalTransferUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `internal_transfers/${id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['InternalTransfer'],
    }),
    deleteInternalTransfer: builder.mutation<
      InternalTransferDeleteResponse,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `internal_transfers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['InternalTransfer'],
    }),
  }),
});

export const {
  useListInternalTransfersQuery,
  useLazyListInternalTransfersQuery,
  useCreateInternalTransferMutation,
  useGetInternalTransferQuery,
  useUpdateInternalTransferMutation,
  useDeleteInternalTransferMutation,
} = internalTransfersApi;

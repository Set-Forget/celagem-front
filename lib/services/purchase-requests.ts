import { NewPurchaseRequest, NewPurchaseRequestResponse, PurchaseRequestDetailResponse, PurchaseRequestListResponse, PurchaseRequestState } from '@/app/(private)/(commercial)/purchases/purchase-requests/schemas/purchase-requests';
import { erpApi } from '@/lib/apis/erp-api';
import { AdaptedPurchaseRequestDetail, AdaptedPurchaseRequestList, getPurchaseRequestAdapter, listPurchaseRequestsAdapter } from '../adapters/purchase-requests';
import { Overwrite } from '../utils';

export const purchaseRequestsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listPurchaseRequests: builder.query<
      AdaptedPurchaseRequestList[],
      {
        name?: string,
        status?: PurchaseRequestState,
        request_date_start?: string,
        request_date_end?: string,
      } | void>({
        query: (data) => ({
          url: '/purchase_requests',
          params: data || {},
        }),
        transformResponse: (response: PurchaseRequestListResponse) => response.data.map(listPurchaseRequestsAdapter),
        providesTags: ['PurchaseRequest'],
      }),
    getPurchaseRequest: builder.query<
      AdaptedPurchaseRequestDetail,
      string | number>({
        query: (id) => `purchase_requests/${id}`,
        transformResponse: (response: PurchaseRequestDetailResponse) => getPurchaseRequestAdapter(response.data),
        providesTags: (result, error, id) => [{ type: 'PurchaseRequest', id }],
      }),
    updatePurchaseRequest: builder.mutation<{ status: string, message: string }, { body: Overwrite<Partial<NewPurchaseRequest>, { request_date: string, company: number }>, id: string | number }>({
      query: ({ body, id }) => ({
        url: `purchase_requests/${id}`,
        method: 'PUT',
        body: { ...body },
      }),
      invalidatesTags: ['PurchaseRequest'],
    }),
    createPurchaseRequest: builder.mutation<NewPurchaseRequestResponse, Overwrite<NewPurchaseRequest, { request_date: string, company: number }>>({
      query: (data) => ({
        url: 'purchase_requests',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PurchaseRequest'],
    }),
    confirmPurchaseRequest: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `purchase_requests/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['PurchaseRequest'],
    }),
    orderPurchaseRequest: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `purchase_requests/${id}/order`,
        method: 'POST',
      }),
      invalidatesTags: ['PurchaseRequest'],
    }),
    cancelPurchaseRequest: builder.mutation<{ status: string, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `purchase_requests/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['PurchaseRequest'],
    }),
  }),
});

export const {
  useListPurchaseRequestsQuery,
  useLazyListPurchaseRequestsQuery,
  useCreatePurchaseRequestMutation,
  useGetPurchaseRequestQuery,
  useUpdatePurchaseRequestMutation,
  useOrderPurchaseRequestMutation,
  useConfirmPurchaseRequestMutation,
  useCancelPurchaseRequestMutation,
} = purchaseRequestsApi;



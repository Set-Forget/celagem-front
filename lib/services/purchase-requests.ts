import { NewPurchaseRequest, NewPurchaseRequestResponse, PurchaseRequestDetail, PurchaseRequestDetailResponse, PurchaseRequestListResponse } from '@/app/(private)/purchases/purchase-requests/schemas/purchase-requests';
import { erpApi } from '@/lib/apis/erp-api';

export const purchaseRequestsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listPurchaseRequests: builder.query<PurchaseRequestListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/purchase_requests',
        params: data || {},
      }),
      providesTags: ['PurchaseRequest'],
    }),
    getPurchaseRequest: builder.query<PurchaseRequestDetail, string>({
      query: (id) => `purchase_requests/${id}`,
      transformResponse: (response: PurchaseRequestDetailResponse) => response.data,
      providesTags: ['PurchaseRequest'],
    }),
    updatePurchaseRequest: builder.mutation<{ status: string, message: string }, Partial<PurchaseRequestDetail>>({
      query: ({ id, ...data }) => ({
        url: `purchase_requests/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PurchaseRequest'],
    }),
    createPurchaseRequest: builder.mutation<NewPurchaseRequestResponse, NewPurchaseRequest>({
      query: (data) => ({
        url: 'purchase_requests',
        method: 'POST',
        body: data,
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
} = purchaseRequestsApi;



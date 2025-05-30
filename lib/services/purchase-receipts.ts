import { NewPurchaseReceipt, PurchaseReceiptDetail, PurchaseReceiptDetailResponse, PurchaseReceiptListResponse } from '@/app/(private)/(commercial)/purchases/purchase-receipts/schemas/purchase-receipts';
import { erpApi } from '@/lib/apis/erp-api';
import { Overwrite } from '../utils';

export const purchaseReceiptsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listPurchaseReceipts: builder.query<PurchaseReceiptListResponse, {
      number?: string,
      supplier?: string,
      reception_date_start?: string,
      reception_date_end?: string,
      scheduled_date_start?: string,
      scheduled_date_end?: string,
    } | void>({
      query: (data) => ({
        url: '/receptions',
        params: data || {},
      }),
      providesTags: ["PurchaseReceipt"],
    }),
    getPurchaseReceipt: builder.query<PurchaseReceiptDetail, string>({
      query: (id) => `/receptions/${id}`,
      transformResponse: (response: PurchaseReceiptDetailResponse) => response.data,
      providesTags: ["PurchaseReceipt"],
    }),
    createPurchaseReceipt: builder.mutation<PurchaseReceiptDetailResponse, Omit<Overwrite<NewPurchaseReceipt, { reception_location: number; source_location: number; reception_date: string }>, "purchase_order">>({
      query: (data) => ({
        url: 'receptions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["PurchaseReceipt"],
    }),
    updatePurchaseReceipt: builder.mutation<PurchaseReceiptDetailResponse, { id: string | number, data: Partial<Omit<Overwrite<NewPurchaseReceipt, { reception_location: number; source_location: number; reception_date: string }>, "purchase_order">> }>({
      query: ({ id, data }) => ({
        url: `receptions/${id}`,
        method: 'PUT',
        body: { ...data },
      }),
      invalidatesTags: ["PurchaseReceipt"],
    }),

    validatePurchaseReceipt: builder.mutation<{ status: string, message: string }, { id: string | number }>({
      query: ({ id }) => ({
        url: `receptions/${id}/validate`,
        method: 'POST',
      }),
      invalidatesTags: ["PurchaseReceipt"],
    }),
  }),
});

export const {
  useListPurchaseReceiptsQuery,
  useGetPurchaseReceiptQuery,
  useCreatePurchaseReceiptMutation,
  useValidatePurchaseReceiptMutation,
  useLazyListPurchaseReceiptsQuery,
  useUpdatePurchaseReceiptMutation,
} = purchaseReceiptsApi;



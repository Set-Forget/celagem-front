import { NewPurchaseReceipt, PurchaseReceiptDetail, PurchaseReceiptDetailResponse, PurchaseReceiptListResponse } from '@/app/(private)/purchases/purchase-receipts/schemas/purchase-receipts';
import { erpApi } from '@/lib/apis/erp-api';
import { Overwrite } from '../utils';

export const purchaseReceiptsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listPurchaseReceipts: builder.query<PurchaseReceiptListResponse, void>({
      query: () => 'receptions',
    }),
    getPurchaseReceipt: builder.query<PurchaseReceiptDetail, string>({
      query: (id) => `/receptions/${id}`,
      transformResponse: (response: PurchaseReceiptDetailResponse) => response.data,
    }),
    createPurchaseReceipt: builder.mutation<PurchaseReceiptDetailResponse, Overwrite<NewPurchaseReceipt, { reception_location: number; source_location: number; reception_date: string }>>({
      query: (data) => ({
        url: 'receptions',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useListPurchaseReceiptsQuery,
  useGetPurchaseReceiptQuery,
  useCreatePurchaseReceiptMutation,
} = purchaseReceiptsApi;



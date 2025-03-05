import { PurchaseReceiptDetail, PurchaseReceiptDetailResponse, PurchaseReceiptListResponse } from '@/app/purchases/purchase-receipts/schemas/purchase-receipts';
import { erpApi } from '@/lib/apis/erp-api';

export const purchaseReceiptsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listPurchaseReceipts: builder.query<PurchaseReceiptListResponse, void>({
      query: () => 'receptions',
    }),

    getPurchaseReceipt: builder.query<PurchaseReceiptDetail, string>({
      query: (id) => `/receptions/${id}`,
      transformResponse: (response: PurchaseReceiptDetailResponse) => response.data,
    }),
  }),
});

export const {
  useListPurchaseReceiptsQuery,
  useGetPurchaseReceiptQuery,
} = purchaseReceiptsApi;



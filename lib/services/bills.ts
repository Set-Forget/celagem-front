import { BillDetail, BillDetailResponse, BillListResponse } from '@/app/purchases/bills/schemas/bills';
import { erpApi } from '@/lib/apis/erp-api';

export const billsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listBills: builder.query<BillListResponse, void>({
      query: () => 'purchase_invoices',
    }),
    getBill: builder.query<BillDetail, string>({
      query: (id) => `/purchase_invoices/${id}`,
      transformResponse: (response: BillDetailResponse) => response.data,
    }),
  }),
});

export const {
  useListBillsQuery,
  useGetBillQuery,
} = billsApi;



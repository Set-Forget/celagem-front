import { CustomerListResponse } from '@/app/(private)/sales/customers/schema/customers';
import { erpApi } from '../apis/erp-api';

export const customersApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listCustomers: builder.query<CustomerListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/customers',
        params: data || {},
      }),
      providesTags: ['Customer']
    }),
  }),
});

export const {
  useListCustomersQuery,
  useLazyListCustomersQuery,
} = customersApi;
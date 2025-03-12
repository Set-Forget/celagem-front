import { CustomerDetail, CustomerDetailResponse, CustomerListResponse, NewCustomer, NewCustomerResponse } from '@/app/(private)/sales/customers/schema/customers';
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
    getCustomer: builder.query<CustomerDetail, number>({
      query: (id) => `/customers/${id}`,
      transformResponse: (response: CustomerDetailResponse) => response.data,
      providesTags: ['Customer']
    }),
    createCustomer: builder.mutation<NewCustomerResponse, Omit<NewCustomer, 'property_payment_term'> & { property_payment_term: number }>({
      query: (data) => ({
        url: '/customers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Customer']
    }),
  }),
});

export const {
  useListCustomersQuery,
  useLazyListCustomersQuery,
  useCreateCustomerMutation,
  useGetCustomerQuery,
} = customersApi;
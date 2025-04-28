import { CustomerDetail, CustomerDetailResponse, CustomerListResponse, NewCustomer, NewCustomerResponse } from '@/app/(private)/sales/customers/schema/customers';
import { erpApi } from '../apis/erp-api';
import { Overwrite } from '../utils';

export const customersApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listCustomers: builder.query<CustomerListResponse,
      {
        name?: string
        status?: true | false
        tax_id?: string
      } | void>({
        query: (data) => ({
          url: '/customers',
          params: data || {},
        }),
        providesTags: ['Customer']
      }),
    getCustomer: builder.query<CustomerDetail, string>({
      query: (id) => `/customers/${id}`,
      transformResponse: (response: CustomerDetailResponse) => response.data,
      providesTags: ['Customer']
    }),
    createCustomer: builder.mutation<NewCustomerResponse, Overwrite<NewCustomer, { property_payment_term?: number, payment_method: number, economic_activity: number }>>({
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
import { CustomerDetail, CustomerDetailResponse, CustomerListResponse, NewCustomer, NewCustomerResponse } from '@/app/(private)/(commercial)/sales/customers/schema/customers';
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
    getCustomer: builder.query<CustomerDetail, string | number>({
      query: (id) => `/customers/${id}`,
      transformResponse: (response: CustomerDetailResponse) => response.data,
      providesTags: ['Customer']
    }),
    createCustomer: builder.mutation<NewCustomerResponse, Omit<Overwrite<NewCustomer, { property_payment_term?: number, payment_method: number, economic_activity: number }>, 'contact_address_inline'>>({
      query: (data) => ({
        url: '/customers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Customer']
    }),
    updateCustomer: builder.mutation<{ status: string, message: string }, { body: Partial<Omit<Overwrite<NewCustomer, { property_payment_term?: number, payment_method: number, economic_activity: number }>, 'contact_address_inline'> & { property_payment_term: number; id: string | number }>, id: string | number }>({
      query: ({ body, id }) => ({
        url: `/customers/${id}`,
        method: 'PUT',
        body: { ...body },
      }),
      invalidatesTags: ['Customer']
    }),
  }),
});

export const {
  useListCustomersQuery,
  useLazyListCustomersQuery,
  useLazyGetCustomerQuery,
  useCreateCustomerMutation,
  useGetCustomerQuery,
  useUpdateCustomerMutation,
} = customersApi;
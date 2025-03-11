import { NewSupplier, NewSupplierResponse, SupplierDetail, SupplierDetailResponse, SupplierListResponse } from '@/app/purchases/vendors/schema/suppliers';
import { erpApi } from '../apis/erp-api';

export const suppliersApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listSuppliers: builder.query<SupplierListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/suppliers',
        params: data || {},
      }),
      providesTags: ['Supplier']
    }),
    getSupplier: builder.query<SupplierDetail, number>({
      query: (id) => `/suppliers/${id}`,
      transformResponse: (response: SupplierDetailResponse) => response.data,
      providesTags: ['Supplier']
    }),
    createSupplier: builder.mutation<NewSupplierResponse, Omit<NewSupplier, 'property_payment_term'> & { property_payment_term: number }>({
      query: (data) => ({
        url: '/suppliers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Supplier']
    }),
  }),
});

export const {
  useListSuppliersQuery,
  useLazyListSuppliersQuery,
  useGetSupplierQuery,
  useCreateSupplierMutation,
} = suppliersApi;
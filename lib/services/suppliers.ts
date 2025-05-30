import { NewSupplier, NewSupplierResponse, SupplierDetail, SupplierDetailResponse, SupplierListResponse } from '@/app/(private)/(commercial)/purchases/vendors/schema/suppliers';
import { erpApi } from '../apis/erp-api';

export const suppliersApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listSuppliers: builder.query<SupplierListResponse,
      {
        name?: string
        status?: true | false
        tax_id?: string
      } | void>({
        query: (data) => ({
          url: '/suppliers',
          params: data || {},
        }),
        providesTags: ['Supplier']
      }),
    getSupplier: builder.query<SupplierDetail, string | number>({
      query: (id) => `/suppliers/${id}`,
      transformResponse: (response: SupplierDetailResponse) => response.data,
      providesTags: ['Supplier']
    }),
    createSupplier: builder.mutation<NewSupplierResponse, Omit<NewSupplier, 'property_payment_term' | 'contact_address_inline'> & { property_payment_term: number }>({
      query: (data) => ({
        url: '/suppliers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Supplier']
    }),
    updateSupplier: builder.mutation<{ status: string, message: string }, { body: Partial<Omit<NewSupplier, 'property_payment_term' | 'contact_address_inline'> & { property_payment_term: number; id: string | number }>, id: string | number }>({
      query: ({ body, id }) => ({
        url: `/suppliers/${id}`,
        method: 'PUT',
        body: { ...body },
      }),
      invalidatesTags: ['Supplier']
    }),
  }),
});

export const {
  useListSuppliersQuery,
  useLazyListSuppliersQuery,
  useLazyGetSupplierQuery,
  useGetSupplierQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} = suppliersApi;
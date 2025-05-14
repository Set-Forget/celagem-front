import { erpApi } from '../apis/erp-api';
import {
  ProductCreateBody,
  ProductsListResponse,
  ProductDeleteResponse,
  ProductResponse,
  ProductUpdateBody,
  Products,
} from '@/app/(private)/inventory/products/schema/products';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const productVariantesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listProducts: builder.query<ProductsListResponse, void>({
      query: (data) => ({
        url: 'products',
      }),
    }),
    createProduct: builder.mutation<ProductResponse, ProductCreateBody>({
      query: (body) => ({
        url: 'products',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Product'],
    }),
    getProduct: builder.query<Products, string>({
      query: (id) => `products/${id}`,
      transformResponse: (response: ProductResponse) => response.data,
      providesTags: ['Product'],
    }),
    updateProduct: builder.mutation<
      ProductResponse,
      { id: string; body: ProductUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `products/${id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation<ProductDeleteResponse, { id: string }>({
      query: ({ id }) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useListProductsQuery,
  useLazyListProductsQuery,
  useCreateProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productVariantesApi;

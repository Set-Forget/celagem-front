import { erpApi } from '../apis/erp-api';
import {
  ProductTemplateCreateBody,
  ProductTemplatesListResponse,
  ProductTemplateDeleteResponse,
  ProductTemplateResponse,
  ProductTemplateUpdateBody,
  ProductTemplates,
} from '@/app/(private)/inventory/product-templates/schema/products-templates';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const productTemplatesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listProductTemplates: builder.query<
      ProductTemplatesListResponse,
      void
    >({
      query: (data) => ({
        url: 'product_templates',
      }),
    }),
    createProductTemplate: builder.mutation<
      ProductTemplateResponse,
      ProductTemplateCreateBody
    >({
      query: (body) => ({
        url: 'product_templates',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['ProductTemplate'],
    }),
    getProductTemplate: builder.query<ProductTemplates, string>({
      query: (id) => `product_templates/${id}`,
      transformResponse: (response: ProductTemplateResponse) => response.data,
      providesTags: ['ProductTemplate'],
    }),
    updateProductTemplate: builder.mutation<
      ProductTemplateResponse,
      { id: string; body: ProductTemplateUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `product_templates/${id}`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: ['ProductTemplate'], 
    }),
    deleteProductTemplate: builder.mutation<
      ProductTemplateDeleteResponse,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `product_templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductTemplate'],
    }),
  }),
});

export const {
  useListProductTemplatesQuery,
  useLazyListProductTemplatesQuery,
  useCreateProductTemplateMutation,
  useGetProductTemplateQuery,
  useUpdateProductTemplateMutation,
  useDeleteProductTemplateMutation,
} = productTemplatesApi;

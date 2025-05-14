import { erpApi } from '../apis/erp-api';
import {
  AttributeCreateBody,
  AttributesListResponse,
  AttributeDeleteResponse,
  AttributeResponse,
  AttributeUpdateBody,
  Attributes,
} from '@/app/(private)/inventory/attributes/schema/attributes';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const attributesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listAttributes: builder.query<AttributesListResponse, void>({
      query: (data) => ({
        url: 'attributes',
      }),
    }),
    createAttribute: builder.mutation<AttributeResponse, AttributeCreateBody>({
      query: (body) => ({
        url: 'attributes',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Attribute'],
    }),
    getAttribute: builder.query<Attributes, string>({
      query: (id) => `attributes/${id}`,
      transformResponse: (response: AttributeResponse) => response.data,
      providesTags: ['Attribute'],
    }),
    updateAttribute: builder.mutation<
      AttributeResponse,
      { id: string; body: AttributeUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `attributes/${id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['Attribute'],
    }),
    deleteAttribute: builder.mutation<AttributeDeleteResponse, { id: string }>({
      query: ({ id }) => ({
        url: `attributes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Attribute'],
    }),
  }),
});

export const {
  useListAttributesQuery,
  useLazyListAttributesQuery,
  useCreateAttributeMutation,
  useGetAttributeQuery,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
} = attributesApi;

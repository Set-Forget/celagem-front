import { MaterialDetail, MaterialDetailResponse, MaterialListResponse } from '@/app/(private)/inventory/stock/schema/materials-inventory';
import {
  MaterialCreateBody,
  MaterialDeleteResponse,
  MaterialResponse,
  MaterialUpdateBody
} from '@/app/(private)/register/materials/schema/materials';
import { erpApi } from '../apis/erp-api';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const materialsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listMaterials: builder.query<MaterialListResponse, { name?: string, default_code?: string } | void>({
      query: (data) => ({
        url: '/products',
        params: data || {},
      }),
      providesTags: ['Material'],
    }),
    createMaterial: builder.mutation<MaterialResponse, MaterialCreateBody>({
      query: (body) => ({
        url: 'materials',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Material'],
    }),
    getMaterial: builder.query<MaterialDetail, string | number>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: MaterialDetailResponse) => response.data,
      providesTags: ['Material'],
    }),
    updateMaterial: builder.mutation<
      MaterialResponse,
      { id: string; body: MaterialUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `materials/${id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['Material'],
    }),
    deleteMaterial: builder.mutation<MaterialDeleteResponse, { id: string }>({
      query: ({ id }) => ({
        url: `materials/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Material'],
    }),
  }),
});

export const {
  useListMaterialsQuery,
  useLazyListMaterialsQuery,
  useLazyGetMaterialQuery,
  useCreateMaterialMutation,
  useGetMaterialQuery,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
} = materialsApi;

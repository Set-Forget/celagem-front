import { erpApi } from '../apis/erp-api';
import {
  MaterialCreateBody,
  MaterialsListResponse,
  MaterialDeleteResponse,
  MaterialResponse,
  MaterialUpdateBody,
  Materials,
} from '@/app/(private)/register/materials/schema/materials';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const materialsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listMaterials: builder.query<MaterialsListResponse, void>({
      query: (data) => ({
        url: 'materials',
      }),
    }),
    createMaterial: builder.mutation<MaterialResponse, MaterialCreateBody>({
      query: (body) => ({
        url: 'materials',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Material'],
    }),
    getMaterial: builder.query<Materials, string>({
      query: (id) => `materials/${id}`,
      transformResponse: (response: MaterialResponse) => response.data,
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
  useCreateMaterialMutation,
  useGetMaterialQuery,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
} = materialsApi;

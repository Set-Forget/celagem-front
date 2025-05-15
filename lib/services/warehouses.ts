import { erpApi } from '../apis/erp-api';
import {
  WarehouseCreateBody,
  WarehousesListResponse,
  WarehouseDeleteResponse,
  WarehouseResponse,
  WarehouseUpdateBody,
  Warehouses,
} from '@/app/(private)/inventory/warehouses/schema/warehouses';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const warehousesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listWarehouses: builder.query<WarehousesListResponse, void>({
      query: () => ({
        url: 'warehouses',
      }),
    }),
    createWarehouse: builder.mutation<WarehouseResponse, WarehouseCreateBody>({
      query: (body) => ({
        url: 'warehouses',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Warehouse'],
    }),
    getWarehouse: builder.query<Warehouses, string>({
      query: (id) => `warehouses/${id}`,
      transformResponse: (response: WarehouseResponse) => response.data,
      providesTags: ['Warehouse'],
    }),
    updateWarehouse: builder.mutation<
      WarehouseResponse,
      { id: string; body: WarehouseUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `warehouses/${id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['Warehouse'],
    }),
    deleteWarehouse: builder.mutation<WarehouseDeleteResponse, { id: string }>({
      query: ({ id }) => ({
        url: `warehouses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Warehouse'],
    }),
  }),
});

export const {
  useListWarehousesQuery,
  useLazyListWarehousesQuery,
  useCreateWarehouseMutation,
  useGetWarehouseQuery,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
} = warehousesApi;

import { MaterialListResponse } from '@/app/(private)/inventory/materials/schema/materials-inventory';
import { erpApi } from '@/lib/apis/erp-api';

export const materialsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listMaterials: builder.query<MaterialListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/product_templates',
        params: data || {},
      }),
      providesTags: ['Material'],
    }),
  }),
});

export const {
  useListMaterialsQuery,
  useLazyListMaterialsQuery
} = materialsApi;



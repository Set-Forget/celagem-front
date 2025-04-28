import { MaterialDetail, MaterialDetailResponse, MaterialListResponse } from '@/app/(private)/inventory/materials/schema/materials-inventory';
import { erpApi } from '@/lib/apis/erp-api';

export const materialsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listMaterials: builder.query<MaterialListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/products',
        params: data || {},
      }),
      providesTags: ['Material'],
    }),
    // ! El type de retorno hay que cambiarlo, ahora esta así porque el get no esta funcionando en el back.
    getMaterial: builder.query<MaterialDetail, number>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: MaterialDetailResponse) => response.data,
      providesTags: ['Material'],
    }),
  }),
});

export const {
  useListMaterialsQuery,
  useLazyListMaterialsQuery,
  useLazyGetMaterialQuery
} = materialsApi;



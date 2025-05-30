import { CostCenterDetail, CostCenterDetailResponse, CostCenterListResponse, NewCostCenter, NewCostCenterResponse } from '@/app/(private)/accounting/cost-centers/schemas/cost-centers';
import { erpApi } from '@/lib/apis/erp-api';

export const costCentersApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listCostCenters: builder.query<CostCenterListResponse, { name?: string } | void>({
      query: (data) => ({
        url: 'cost_centers',
        params: data || {},
      }),
      providesTags: ['CostCenter'],
    }),
    getCostCenter: builder.query<CostCenterDetail, string | number>({
      query: (id) => `cost_centers/${id}`,
      providesTags: ['CostCenter'],
      transformResponse: (response: CostCenterDetailResponse) => response.data
    }),
    createCostCenter: builder.mutation<NewCostCenterResponse, NewCostCenter>({
      query: (body) => ({
        url: 'cost_centers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CostCenter'],
    }),
    updateCostCenter: builder.mutation<CostCenterDetail, { id: string; body: { active: boolean } }>({
      query: ({ id, body }) => ({
        url: `cost_centers/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['CostCenter'],
    }),
  }),
});

export const {
  useListCostCentersQuery,
  useLazyListCostCentersQuery,
  useGetCostCenterQuery,
  useUpdateCostCenterMutation,
  useCreateCostCenterMutation,
} = costCentersApi;
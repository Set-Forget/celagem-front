import { EconomicActivityDetail, EconomicActivityDetailResponse, EconomicActivityListResponse, NewEconomicActivity, NewEconomicActivityResponse } from '@/app/(private)/management/economic-activities/schema/economic-activities';
import { erpApi } from '@/lib/apis/erp-api';

export const economicActivitiesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listEconomicActivities: builder.query<EconomicActivityListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/economic_activities',
        params: data || {},
      }),
      providesTags: ['EconomicActivity'],
    }),
    getEconomicActivity: builder.query<EconomicActivityDetail, number | string>({
      query: (id) => ({
        url: `/economic_activities/${id}`,
      }),
      transformResponse: (response: EconomicActivityDetailResponse) => response.data,
      providesTags: ['EconomicActivity'],
    }),
    createEconomicActivity: builder.mutation<NewEconomicActivityResponse, NewEconomicActivity>({
      query: (data) => ({
        url: '/economic_activities',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['EconomicActivity'],
    }),
    updateEconomicActivity: builder.mutation<EconomicActivityDetailResponse, { id: number | string, body: Partial<NewEconomicActivity> }>({
      query: ({ id, body }) => ({
        url: `/economic_activities/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['EconomicActivity'],
    }),
  }),
});

export const {
  useListEconomicActivitiesQuery,
  useLazyListEconomicActivitiesQuery,
  useGetEconomicActivityQuery,
  useCreateEconomicActivityMutation,
  useUpdateEconomicActivityMutation,
} = economicActivitiesApi;



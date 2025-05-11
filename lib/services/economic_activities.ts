import { erpApi } from '@/lib/apis/erp-api';
import { EconomicActivityListResponse } from '../schemas/economic_activities';

export const economicActivitiesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listEconomicActivities: builder.query<EconomicActivityListResponse, { name?: string } | void>({
      query: (data) => ({
        url: '/economic_activities',
        params: data || {},
      }),
    }),
  }),
});

export const {
  useListEconomicActivitiesQuery,
  useLazyListEconomicActivitiesQuery,
} = economicActivitiesApi;



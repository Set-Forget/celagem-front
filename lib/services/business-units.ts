import { ListBusinessUnitResponse } from '@/app/(private)/medical-management/calendar/schemas/business-units';
import { usersApi } from '@/lib/apis/users-api';

export const businessUnitsApi = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    listBusinessUnits: builder.query<ListBusinessUnitResponse, void>({
      query: () => 'businessunits',
    }),
  }),
});

export const {
  useListBusinessUnitsQuery,
  useLazyListBusinessUnitsQuery
} = businessUnitsApi;



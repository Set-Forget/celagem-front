import { ListBusinessUnitResponse } from '@/app/medical-management/scheduler/schemas/business-units';
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
} = businessUnitsApi;



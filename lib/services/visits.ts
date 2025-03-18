import { NewVisit, NewVisitResponse } from '@/app/(private)/medical-management/visits/schemas/visits';
import { hcApi } from '@/lib/apis/hc-api';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const visitsApi = hcApi.injectEndpoints({
  endpoints: (builder) => ({
    createVisit: builder.query<NewVisitResponse, NewVisit>({
      query: () => 'visit',
      providesTags: ['Visit'],
    }),
  }),
});

export const {
  useCreateVisitQuery,
} = visitsApi;
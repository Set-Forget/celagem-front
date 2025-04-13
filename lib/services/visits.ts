import { NewVisit, NewVisitResponse, VisitDetail, VisitDetailResponse, VisitListResponse } from '@/app/(private)/medical-management/visits/schemas/visits';
import { hcApi } from '@/lib/apis/hc-api';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const visitsApi = hcApi.injectEndpoints({
  endpoints: (builder) => ({
    listVisits: builder.query<VisitListResponse, void>({
      query: () => 'visit',
      providesTags: ['Visit'],
    }),
    createVisit: builder.mutation<NewVisitResponse, NewVisit>({
      query: (body) => ({
        url: 'visit',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Visit'],
    }),
    getVisit: builder.query<VisitDetail, string>({
      query: (id) => `visit/${id}`,
      transformResponse: (response: VisitDetailResponse) => response.data,
      providesTags: ['Visit'],
    }),
    updateVisit: builder.mutation<VisitDetailResponse, { id: string, body: Partial<NewVisit> }>({
      query: ({ id, body }) => ({
        url: `visit/${id}`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: ['Visit'],
    }),
  }),
});

export const {
  useListVisitsQuery,
  useCreateVisitMutation,
  useUpdateVisitMutation,
  useGetVisitQuery,
} = visitsApi;
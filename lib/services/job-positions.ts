import { erpApi } from '../apis/erp-api';
import {
  JobPositionCreateBody,
  JobPositionsListResponse,
  JobPositionDeleteResponse,
  JobPositionResponse,
  JobPositionUpdateBody,
  JobPositions,
} from '@/app/(private)/register/job-positions/schema/job-positions';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const jobPositionsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listJobPositions: builder.query<
      JobPositionsListResponse,
      void
    >({
      query: (data) => ({
        url: 'job-positions',
      }),
    }),
    createJobPosition: builder.mutation<JobPositionResponse, JobPositionCreateBody>({
      query: (body) => ({
        url: 'job-positions',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['JobPosition'],
    }),
    getJobPosition: builder.query<JobPositions, string>({
      query: (id) => `job-positions/${id}`,
      transformResponse: (response: JobPositionResponse) => response.data,
      providesTags: ['JobPosition'],
    }),
    updateJobPosition: builder.mutation<
      JobPositionResponse,
      { id: string; body: JobPositionUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `job-positions/${id}`, 
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: ['JobPosition'],
    }),
    deleteJobPosition: builder.mutation<JobPositionDeleteResponse, { id: string }>({
      query: ({ id }) => ({
        url: `job-positions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['JobPosition'],
    }),
  }),
});

export const {
  useListJobPositionsQuery,
  useLazyListJobPositionsQuery,
  useCreateJobPositionMutation,
  useGetJobPositionQuery,
  useUpdateJobPositionMutation,
  useDeleteJobPositionMutation,
} = jobPositionsApi;
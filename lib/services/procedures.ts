import { erpApi } from '../apis/erp-api';
import {
  ProcedureCreateBody,
  ProceduresListResponse,
  ProcedureDeleteResponse,
  ProcedureResponse,
  Procedures,
  ProcedureUpdateBody,
} from '@/app/(private)/register/procedures/schema/procedures';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const proceduresApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listProcedures: builder.query<
      ProceduresListResponse,
      { Name: string; CompanyId: string }
    >({
      query: (data) => ({
        url: 'procedures',
        params: data || {},
      }),
    }),
    createProcedure: builder.mutation<ProcedureResponse, ProcedureCreateBody>({
      query: (body) => ({
        url: 'procedures',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Procedure'],
    }),
    getProcedure: builder.query<Procedures, string>({
      query: (id) => `procedures/${id}`,
      transformResponse: (response: ProcedureResponse) => response.data,
      providesTags: ['Procedure'],
    }),
    updateProcedure: builder.mutation<
      ProcedureResponse,
      { id: string; body: ProcedureUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `procedures/${id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['Procedure'],
    }),
    deleteProcedure: builder.mutation<ProcedureDeleteResponse, { id: string }>({
      query: ({ id }) => ({
        url: `procedures/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Procedure'],
    }),
  }),
});

export const {
  useListProceduresQuery,
  useLazyListProceduresQuery,
  useCreateProcedureMutation,
  useGetProcedureQuery,
  useUpdateProcedureMutation,
  useDeleteProcedureMutation,
} = proceduresApi;

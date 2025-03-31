import { erpApi } from '../apis/erp-api';
import {
  MedicalExamCreateBody,
  MedicalExamsListResponse,
  MedicalExamDeleteResponse,
  MedicalExamResponse,
  MedicalExamUpdateBody,
  MedicalExams,
} from '@/app/(private)/register/medical-exams/schema/medical-exams';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const medicalExamsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listMedicalExams: builder.query<
      MedicalExamsListResponse,
      void
    >({
      query: (data) => ({
        url: 'medical-exams',
      }),
    }),
    createMedicalExam: builder.mutation<MedicalExamResponse, MedicalExamCreateBody>({
      query: (body) => ({
        url: 'medical-exams',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['MedicalExam'],
    }),
    getMedicalExam: builder.query<MedicalExams, string>({
      query: (id) => `medical-exams/${id}`,
      transformResponse: (response: MedicalExamResponse) => response.data,
      providesTags: ['MedicalExam'],
    }),
    updateMedicalExam: builder.mutation<
      MedicalExamResponse,
      { id: string; body: MedicalExamUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `medical-exams/${id}`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: ['MedicalExam'],
    }),
    deleteMedicalExam: builder.mutation<MedicalExamDeleteResponse, { id: string }>({
      query: ({ id }) => ({
        url: `medical-exams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MedicalExam'],
    }),
  }),
});

export const {
  useListMedicalExamsQuery,
  useLazyListMedicalExamsQuery,
  useCreateMedicalExamMutation,
  useGetMedicalExamQuery,
  useUpdateMedicalExamMutation,
  useDeleteMedicalExamMutation,
} = medicalExamsApi;
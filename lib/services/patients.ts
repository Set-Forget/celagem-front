import { NewPatient, NewPatientResponse, PatientCareCompanyListResponse, PatientDetail, PatientDetailResponse, PatientListResponse } from '@/app/(private)/medical-management/patients/schema/patients';
import { hcApi } from '@/lib/apis/hc-api';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const patientsApi = hcApi.injectEndpoints({
  endpoints: (builder) => ({
    listPatients: builder.query<PatientListResponse, void>({
      query: () => 'patient',
      providesTags: ['Patient']
    }),
    listCareCompanies: builder.query<PatientCareCompanyListResponse, void>({
      query: () => 'patient/care-company',
    }),

    getPatient: builder.query<PatientDetail, string>({
      query: (id) => `patient/${id}`,
      transformResponse: (response: PatientDetailResponse) => response.data,
      providesTags: ['Patient']
    }),

    updatePatient: builder.mutation<{ status: string }, { id: string, body: Partial<NewPatient> }>({
      query: ({ id, body }) => ({
        url: `patient/${id}`,
        method: 'PUT',
        body: body
      }),
      invalidatesTags: ['Patient']
    }),
    createPatient: builder.mutation<NewPatientResponse, NewPatient>({
      query: (data) => ({
        url: 'patient',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Patient']
    }),
  }),
});

export const {
  useListPatientsQuery,
  useLazyListPatientsQuery,
  useLazyListCareCompaniesQuery,
  useGetPatientQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation
} = patientsApi;
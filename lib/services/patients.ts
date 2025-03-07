import { PatientDetail, PatientDetailResponse, PatientListResponse } from '@/app/medical-management/patients/schema/patients';
import { hcApi } from '@/lib/apis/hc-api';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const patientsApi = hcApi.injectEndpoints({
  endpoints: (builder) => ({
    listPatients: builder.query<PatientListResponse, void>({
      query: () => 'patient',
      providesTags: ['Patient']
    }),
    getPatient: builder.query<PatientDetail, string>({
      query: (id) => `patient/${id}`,
      transformResponse: (response: PatientDetailResponse) => response.data,
      providesTags: ['Patient']
    }),
    createPatient: builder.mutation<void, void>({
      query: () => ({
        url: 'patient',
        method: 'POST'
      }),
      invalidatesTags: ['Patient']
    }),
  }),
});

export const {
  useListPatientsQuery,
  useLazyListPatientsQuery,
  useGetPatientQuery,
} = patientsApi;
import {
  NewPatient,
  NewPatientResponse,
  PatientCareCompanyListResponse,
  PatientDetail,
  PatientDetailResponse,
  PatientListResponse,
} from '@/app/(private)/medical-management/patients/schema/patients';
import { hcApi } from '@/lib/apis/hc-api';
import { Overwrite } from '../utils';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const patientsApi = hcApi.injectEndpoints({
  endpoints: (builder) => ({
    listPatients: builder.query<PatientListResponse, { name?: string, company_id?: string } | void>({
      query: (data) => ({
        url: 'patient',
        params: data || {},
      }),
      providesTags: ['Patient'],
    }),
    listCareCompanies: builder.query<PatientCareCompanyListResponse, void>({
      query: () => 'care-company',
    }),
    getPatient: builder.query<PatientDetail, string>({
      query: (id) => `patient/${id}`,
      transformResponse: (response: PatientDetailResponse) => response.data,
      providesTags: ['Patient'],
    }),
    updatePatient: builder.mutation<NewPatientResponse, { id: string, body: Partial<Overwrite<NewPatient, { birthdate: string }>> }>({
      query: ({ id, body }) => ({
        url: `patient/${id}`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: ['Patient'],
    }),
    createPatient: builder.mutation<
      NewPatientResponse,
      Overwrite<NewPatient, { birthdate: string }>
    >({
      query: (data) => ({
        url: 'patient',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Patient'],
    }),
  }),
});

export const {
  useListPatientsQuery,
  useLazyListPatientsQuery,
  useLazyListCareCompaniesQuery,
  useGetPatientQuery,
  useLazyGetPatientQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
} = patientsApi;

import { AppointmentList, DoctorListResponse, NewAppointment, PatientListResponse } from '@/app/medical-management/scheduler/schemas/appointments';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const medicalManagementApi = createApi({
  reducerPath: 'medicalManagementApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/hc/api/' }),
  endpoints: (builder) => ({
    listAppointments: builder.query<AppointmentList[], void>({
      query: () => 'appointments',
    }),
    searchAppointments: builder.query<AppointmentList[], { start_date: string }>({
      query: ({ start_date }) => `appointments/search?start_date=${start_date}`,
    }),
    createAppointment: builder.mutation<void, NewAppointment & { start_time: string, end_time: string }>({
      query: (body) => ({
        url: 'appointment',
        method: 'POST',
        body: body,
      }),
    }),

    listPatients: builder.query<PatientListResponse, void>({
      query: () => 'patient',
    }),
  }),
});

export const {
  useListAppointmentsQuery,
  useSearchAppointmentsQuery,
  useListPatientsQuery,
  useCreateAppointmentMutation,
} = medicalManagementApi;
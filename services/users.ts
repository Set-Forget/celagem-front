import { AppointmentList } from '@/app/medical-management/scheduler/schemas/appointments';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    listAppointments: builder.query<AppointmentList[], void>({
      query: () => 'appointments',
    }),
    searchAppointments: builder.query<AppointmentList[], { start_date: string }>({
      query: ({ start_date }) => `appointments/search?start_date=${start_date}`,
    }),
  }),
});

export const {
  useListAppointmentsQuery,
  useSearchAppointmentsQuery
} = usersApi;
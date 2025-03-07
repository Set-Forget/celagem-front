import { AppointmentDetail, AppointmentDetailResponse, AppointmentListResponse, NewAppointment } from '@/app/medical-management/scheduler/schemas/appointments';
import { hcApi } from '@/lib/apis/hc-api';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const appointmentsApi = hcApi.injectEndpoints({
  endpoints: (builder) => ({
    listAppointments: builder.query<AppointmentListResponse, void>({
      query: () => 'appointment',
      providesTags: ['Appointment'],
    }),
    getAppointment: builder.query<AppointmentDetail, string>({
      query: (id) => `appointment/${id}`,
      transformResponse: (response: AppointmentDetailResponse) => response.data,
      providesTags: ['Appointment'],
    }),
    searchAppointments: builder.query<AppointmentListResponse, { range_start_date: string, range_end_date: string }>({
      query: ({ range_start_date, range_end_date }) => `appointment/search?range_start_date=${range_start_date}&range_end_date=${range_end_date}`,
      providesTags: ['Appointment'],
    }),
    //---
    createAppointment: builder.mutation<
      AppointmentDetailResponse,
      Omit<NewAppointment, "attention_type"> & { start_time: string, end_time: string }
    >({
      query: (body) => ({
        url: 'appointment',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Appointment'],
    }),
    deleteAppointment: builder.mutation<{ code: number, data: object, message: string, status: string }, { id: string }>({
      query: ({ id }) => ({
        url: `appointment/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Appointment'],
    }),
    updateAppointment: builder.mutation<AppointmentDetailResponse, { id: string, body: Partial<NewAppointment> }>({
      query: ({ id, body }) => ({
        url: `appointment/${id}`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: ['Appointment'],
    }),
  }),
});

export const {
  useListAppointmentsQuery,
  useSearchAppointmentsQuery,
  useCreateAppointmentMutation,
  useDeleteAppointmentMutation,
  useUpdateAppointmentMutation,
  useGetAppointmentQuery,
} = appointmentsApi;
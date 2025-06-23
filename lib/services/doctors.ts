
import { hcApi } from '../apis/hc-api';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const doctorsApi = hcApi.injectEndpoints({
  endpoints: (builder) => ({
    createDoctor: builder.mutation<{ status: string, code: number, message: string }, { id: string, signature: string, image: string, speciality_id: number }>({
      query: (body) => ({
        url: `/doctor`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Doctor'],
    }),
    getDoctor: builder.query<{ id: string, name: string, specialization_id: number, signature: string, specialization_name: string }, string>({
      query: (id) => ({
        url: `/doctor/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: { status: string, code: number, message: string, data: { id: string, name: string, specialization_id: number, signature: string, specialization_name: string } }) => {
        return response.data
      },
      providesTags: ['Doctor'],
    }),
    updateDoctor: builder.mutation<{ status: string, code: number, message: string }, { id: string, speciality_id?: number, image?: string }>({
      query: (body) => ({
        url: `/doctor/${body.id}`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: ['Doctor'],
    }),
    getSignature: builder.query<string, string>({
      query: (id) => ({
        url: `/doctor/${id}/signature`,
        method: 'GET',
      }),
      transformResponse: (response: { status: string, code: number, message: string, data: string }) => response.data,
      providesTags: ['Doctor'],
    }),
  }),
});

export const {
  useCreateDoctorMutation,
  useGetSignatureQuery,
  useLazyGetSignatureQuery,
  useGetDoctorQuery,
  useLazyGetDoctorQuery,
  useUpdateDoctorMutation,
} = doctorsApi;


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
    }),
    getSignature: builder.query<{ status: string, code: number, message: string, data: string }, string>({
      query: (id) => ({
        url: `/doctor/${id}/signature`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCreateDoctorMutation,
  useGetSignatureQuery,
  useLazyGetSignatureQuery,
} = doctorsApi;

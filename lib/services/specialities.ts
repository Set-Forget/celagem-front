import { hcApi } from '../apis/hc-api';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const specialitiesApi = hcApi.injectEndpoints({
  endpoints: (builder) => ({
    listSpecialities: builder.query<{ title: string, id: number }[], void>({
      query: (params) => ({
        url: `/doctor/speciality`,
        method: 'GET',
        params: params ?? {},
      }),
      providesTags: ['Speciality'],
    }),
  }),
});

export const {
  useListSpecialitiesQuery,
  useLazyListSpecialitiesQuery,
} = specialitiesApi;

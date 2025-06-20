import { GetProfileResponse, SignInResponse } from '@/app/(public)/sign-in/schemas/sign-in';
import { usersApi } from '../apis/users-api';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const authApi = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<SignInResponse, { email: string, password: string }>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    getProfile: builder.query<GetProfileResponse, void>({
      query: () => ({
        url: '/auth/profile',
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
  }),
});

export const {
  useSignInMutation,
  useGetProfileQuery,
} = authApi;
import { usersApi } from '../apis/users-api';
import {
  ClassCreateBody,
  ClassesListResponse,
  ClassDeleteResponse,
  ClassResponse,
  ClassUpdateBody,
  Classes,
} from '@/app/(private)/management/classes/schema/classes';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const userApi = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    listClasses: builder.query<
      ClassesListResponse,
      { Name: string; CompanyId: string }
    >({
      query: (data) => ({
        url: 'classes',
        params: data || {},
      }),
    }),
    createClass: builder.mutation<ClassResponse, ClassCreateBody>({
      query: (body) => ({
        url: 'classes',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Class'],
    }),
    getClass: builder.query<Classes, string>({
      query: (id) => `classes/${id}`,
      transformResponse: (response: ClassResponse) => response.data,
      providesTags: ['Class'],
    }),
    updateClass: builder.mutation<
      ClassResponse,
      { id: string; body: ClassUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `classes/${id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['Class'],
    }),
    deleteClass: builder.mutation<ClassDeleteResponse, { id: string }>({
      query: ({ id }) => ({
        url: `classes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Class'],
    }),
  }),
});

export const {
  useListClassesQuery,
  useLazyListClassesQuery,
  useCreateClassMutation,
  useGetClassQuery,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = userApi;

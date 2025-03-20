import { usersApi } from '../apis/users-api';
import {
  ClassCreateBody,
  ClassEditBody,
  ClassesListResponse,
  ClassOperationResponse,
  ClassResponse,
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
    retrieveClass: builder.query<ClassResponse, { id: string }>({
      query: ({ id }) => `classes/${id}`,
      providesTags: ['Class'],
    }),
    editClass: builder.mutation<
      ClassResponse,
      { id: string; body: ClassEditBody }
    >({
      query: ({ id, body }) => ({
        url: `classes/${id}`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: ['Class'],
    }),
    deleteClass: builder.mutation<ClassOperationResponse, { id: string }>({
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
  useCreateClassMutation,
  useRetrieveClassQuery,
  useEditClassMutation,
  useDeleteClassMutation,
} = userApi;
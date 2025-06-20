import { ClassDetail, ClassDetailResponse, ClassListResponse, NewClass, NewClassResponse } from '@/app/(private)/management/classes/schema/classes';
import { usersApi } from '../apis/users-api';

export const userApi = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    listClasses: builder.query<ClassListResponse, void>({
      query: () => 'classes',
      providesTags: ['Class'],
    }),
    createClass: builder.mutation<NewClassResponse, NewClass>({
      query: (body) => ({
        url: 'classes',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Class'],
    }),
    getClass: builder.query<ClassDetail, string>({
      query: (id) => `classes/${id}`,
      transformResponse: (response: ClassDetailResponse) => response.data,
      providesTags: ['Class'],
    }),
    updateClass: builder.mutation<NewClassResponse, { id: string; body: Partial<NewClass> }>({
      query: ({ id, body }) => ({
        url: `classes/${id}`,
        method: 'PUT',
        body: body,
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
} = userApi;

import { erpApi } from '../apis/erp-api';
import {
  ServiceCreateBody,
  ServicesListResponse,
  ServiceDeleteResponse,
  ServiceResponse,
  ServiceUpdateBody,
  Services,
} from '@/app/(private)/register/services/schema/services';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const servicesApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listServices: builder.query<ServicesListResponse, void>({
      query: (data) => ({
        url: 'services',
      }),
    }),
    createService: builder.mutation<ServiceResponse, ServiceCreateBody>({
      query: (body) => ({
        url: 'services',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Service'],
    }),
    getService: builder.query<Services, string>({
      query: (id) => `services/${id}`,
      transformResponse: (response: ServiceResponse) => response.data,
      providesTags: ['Service'],
    }),
    updateService: builder.mutation<
      ServiceResponse,
      { id: string; body: ServiceUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `classes/${id}`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: ['Service'],
    }),
    deleteService: builder.mutation<ServiceDeleteResponse, { id: string }>({
      query: ({ id }) => ({
        url: `services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Service'],
    }),
  }),
});

export const {
  useListServicesQuery,
  useLazyListServicesQuery,
  useCreateServiceMutation,
  useGetServiceQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApi;

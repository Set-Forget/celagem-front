import { erpApi } from '../apis/erp-api';
import {
  LocationCreateBody,
  LocationsListResponse,
  LocationDeleteResponse,
  LocationResponse,
  LocationUpdateBody,
  Locations,
} from '@/app/(private)/inventory/locations/schema/locations';

// actualmente se está usando un proxy para redirigir las peticiones a la API de backend, el proxy esta en next.config.mjs
export const locationsApi = erpApi.injectEndpoints({
  endpoints: (builder) => ({
    listLocations: builder.query<LocationsListResponse, void>({
      query: () => ({
        url: 'locations',
      }),
    }),
    createLocation: builder.mutation<LocationResponse, LocationCreateBody>({
      query: (body) => ({
        url: 'locations',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Location'],
    }),
    getLocation: builder.query<Locations, string>({
      query: (id) => `locations/${id}`,
      transformResponse: (response: LocationResponse) => response.data,
      providesTags: ['Location'],
    }),
    updateLocation: builder.mutation<
      LocationResponse,
      { id: string; body: LocationUpdateBody }
    >({
      query: ({ id, body }) => ({
        url: `locations/${id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['Location'],
    }),
    deleteLocation: builder.mutation<LocationDeleteResponse, { id: string }>({
      query: ({ id }) => ({
        url: `locations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Location'],
    }),
  }),
});

export const {
  useListLocationsQuery,
  useLazyListLocationsQuery,
  useCreateLocationMutation,
  useGetLocationQuery,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = locationsApi;

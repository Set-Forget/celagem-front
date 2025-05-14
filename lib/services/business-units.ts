import {
  BusinessUnitsListResponse,
  BusinessUnitResponse,
  BusinessUnitOperationResponse,
  BusinessUnitCreateBody,
  BusinessUnitUpdateBody,
  BusinessUnitAddUser,
  BusinessUnitAddPatient,
  BusinessUnit,
} from '@/app/(private)/management/business-units/schema/business-units';
import { usersApi } from '@/lib/apis/users-api';

export const businessUnitsApi = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    listBusinessUnits: builder.query<
      BusinessUnitsListResponse,
      void
    >({
      query: () => ({
        url: `businessunits`,
      }),
      providesTags: ['BusinessUnit'],
    }),
    getBusinessUnit: builder.query<
      BusinessUnit,
      string
    >({
      query: (id) => `businessunits/${id}`,
      transformResponse: (response: BusinessUnitResponse) =>
        response.data,
      providesTags: ['BusinessUnit'],
    }),
    createBusinessUnit: builder.mutation<
      BusinessUnitResponse,
      BusinessUnitCreateBody
    >({
      query: (body) => ({
        url: 'businessunits',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['BusinessUnit'],
    }),
    updateBusinessUnit: builder.mutation<
      BusinessUnitResponse,
      { Id: string; Body: BusinessUnitUpdateBody }
    >({
      query: ({ Id, Body }) => ({
        url: `businessunits/${Id}`,
        method: 'PUT',
        body: Body,
      }),
      invalidatesTags: ['BusinessUnit'],
    }),
    deleteBusinessUnit: builder.mutation<
      BusinessUnitOperationResponse,
      { Id: string }
    >({
      query: ({ Id }) => ({
        url: `businessunits/${Id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BusinessUnit'],
    }),
    addUserToBusinessUnit: builder.mutation<
      BusinessUnitOperationResponse,
      { Id: string; Body: BusinessUnitAddUser }
    >({
      query: ({ Id, Body }) => ({
        url: `businessunits/${Id}/users`,
        method: 'POST',
        body: Body,
      }),
      invalidatesTags: ['BusinessUnit'],
    }),
    deleteUserFromBusinessUnit: builder.mutation<
      BusinessUnitOperationResponse,
      { Id: string; UserId: string }
    >({
      query: ({ Id, UserId }) => ({
        url: `businessunits/${Id}/users/${UserId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BusinessUnit'],
    }),
    addPatientToBusinessUnit: builder.mutation<
      BusinessUnitOperationResponse,
      { Id: string; Body: BusinessUnitAddPatient }
    >({
      query: ({ Id, Body }) => ({
        url: `businessunits/${Id}/patients`,
        method: 'POST',
        body: Body,
      }),
      invalidatesTags: ['BusinessUnit'],
    }),
    deletePatientFromBusinessUnit: builder.mutation<
      BusinessUnitOperationResponse,
      { Id: string; PatientId: string }
    >({
      query: ({ Id, PatientId }) => ({
        url: `businessunits/${Id}/patients/${PatientId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BusinessUnit'],
    }),
  }),
});

export const {
  useListBusinessUnitsQuery,
  useLazyListBusinessUnitsQuery,
  useGetBusinessUnitQuery,
  useCreateBusinessUnitMutation,
  useUpdateBusinessUnitMutation,
  useAddUserToBusinessUnitMutation,
  useDeleteUserFromBusinessUnitMutation,
  useAddPatientToBusinessUnitMutation,
  useDeletePatientFromBusinessUnitMutation,
  useDeleteBusinessUnitMutation,
} = businessUnitsApi;

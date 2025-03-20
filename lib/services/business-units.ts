import {
  BusinessUnitsListResponse,
  BusinessUnitRetrieveResponse,
  BusinessUnitResponse,
  BusinessUnitOperationResponse,
  BusinessUnitCreateBody,
  BusinessUnitEditBody,
  BusinessUnitAddUser,
  BusinessUnitAddPatient,
} from '@/app/(private)/management/business-units/schema/business-units';
import { usersApi } from '@/lib/apis/users-api';

export const businessUnitsApi = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    listBusinessUnits: builder.query<
      BusinessUnitsListResponse,
      { Name: string; CompanyId: string }
    >({
      query: (data) => ({
        url: `businessunits`,
        params: data || {},
      }),
      providesTags: ['BusinessUnit'],
    }),
    retrieveBusinessUnit: builder.query<
      BusinessUnitRetrieveResponse,
      { Id: string }
    >({
      query: ({ Id }) => `businessunits/${Id}`,
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
    editBusinessUnit: builder.mutation<
      BusinessUnitResponse,
      { Id: string; Body: BusinessUnitEditBody }
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
  useRetrieveBusinessUnitQuery,
  useCreateBusinessUnitMutation,
  useEditBusinessUnitMutation,
  useAddUserToBusinessUnitMutation,
  useDeleteUserFromBusinessUnitMutation,
  useAddPatientToBusinessUnitMutation,
  useDeletePatientFromBusinessUnitMutation,
  useDeleteBusinessUnitMutation,
} = businessUnitsApi;

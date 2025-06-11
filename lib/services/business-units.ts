
import { BusinessUnitDetail, BusinessUnitDetailResponse, BusinessUnitListResponse, NewBusinessUnit, NewBusinessUnitResponse } from '@/app/(private)/management/business-units/schema/business-units';
import { usersApi } from '@/lib/apis/users-api';

export const businessUnitsApi = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    listBusinessUnits: builder.query<BusinessUnitListResponse, { name?: string, company_id?: string } | void>({
      query: (params) => ({
        url: '/businessunits',
        params: params || {}
      }),
      providesTags: ['BusinessUnit'],
    }),
    getBusinessUnit: builder.query<BusinessUnitDetail, string>({
      query: (id) => `/businessunits/${id}`,
      transformResponse: (response: BusinessUnitDetailResponse) => response.data,
      providesTags: ['BusinessUnit'],
    }),
    createBusinessUnit: builder.mutation<NewBusinessUnitResponse, NewBusinessUnit>({
      query: (body) => ({
        url: '/businessunits',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['BusinessUnit'],
    }),
    updateBusinessUnit: builder.mutation<NewBusinessUnitResponse, { id: string; body: Partial<NewBusinessUnit> }>({
      query: ({ id, body }) => ({
        url: `/businessunits/${id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['BusinessUnit'],
    }),
  }),
});

export const {
  useListBusinessUnitsQuery,
  useLazyListBusinessUnitsQuery,
  useGetBusinessUnitQuery,
  useLazyGetBusinessUnitQuery,
  useCreateBusinessUnitMutation,
  useUpdateBusinessUnitMutation,
} = businessUnitsApi;

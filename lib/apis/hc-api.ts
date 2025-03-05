import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const hcApi = createApi({
  reducerPath: 'hcApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/hc/api/' }),
  tagTypes: ['Template', 'Patient', 'Appointment'],
  endpoints: () => ({}),
});
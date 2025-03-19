import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const hcApi = createApi({
  reducerPath: 'hcApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/hc/api/',
    prepareHeaders(headers) {
      const token = Cookies.get('sessionToken')
      if (token) {
        headers.set('X-JWT-Token', `${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Template', 'Patient', 'Appointment', 'Visit', 'Section', 'Field'],
  endpoints: () => ({}),
});
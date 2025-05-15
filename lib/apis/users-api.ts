import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/users/api/',
    prepareHeaders(headers) {
      const token = Cookies.get('sessionToken')
      if (token) {
        headers.set('X-JWT-Token', `${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['BusinessUnit', 'User', 'Role', 'Class', 'Company'],
  endpoints: () => ({}),
});
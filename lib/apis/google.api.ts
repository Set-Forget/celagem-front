import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const googleApi = createApi({
  reducerPath: 'googleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/google/places'
  }),
  tagTypes: [],
  endpoints: () => ({}),
});

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const telegramApi = createApi({
  reducerPath: 'telegramApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/`,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  tagTypes: [],
  endpoints: () => ({}),
});

import { telegramApi } from "../apis/telegram.api";

export const errorsApi = telegramApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<void, string>({
      query: (message) => ({
        url: '/sendMessage',
        method: 'POST',
        body: {
          chat_id: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID,
          text: message,
        },
      }),
    }),
  }),
});

export const {
  useSendMessageMutation,
} = errorsApi;

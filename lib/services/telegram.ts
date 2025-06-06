import { telegramApi } from '../apis/telegram.api';

type Args = { location: string; error?: Error; fnLocation?: string; rawError?: any };

export const errorsApi = telegramApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<void, Args>({
      async queryFn(
        { location, error, fnLocation, rawError }: Args,
        _api,
        _extraOptions,
        baseQuery
      ) {
        if (process.env.NODE_ENV !== 'production') {
          return { data: null as any };
        }

        const result = await baseQuery({
          url: '/sendMessage',
          method: 'POST',
          body: {
            chat_id: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID,
            parse_mode: 'Markdown',
            text:
              `**🚨 Error detectado en la aplicación**  
*Fecha y hora:* \`${new Date().toLocaleString()}\`

---

**Ubicación:**  
\`${location}\`

**Función:**  
\`${fnLocation ?? 'N/A'}\`
` +
              (error
                ? `
**Tipo de error:**  
\`\`\`
${error.name}
\`\`\`

**Mensaje detallado:**
\`\`\`
${error.message}
\`\`\`
---

*Stack trace:*  
\`\`\`
${error.stack || 'No disponible'}
\`\`\`
`
                :
                `
*Error original:*  
\`\`\`
${JSON.stringify(rawError)}
\`\`\``
              ),
          },
        });

        if (result.error) {
          return { error: result.error };
        }

        return { data: result.data as void };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useSendMessageMutation } = errorsApi;

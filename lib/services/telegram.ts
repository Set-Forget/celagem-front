import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { telegramApi } from '../apis/telegram.api';

export const errorsApi = telegramApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<
      void,
      { location: string; error: Error; fnLocation?: string }
    >({
      query: ({ location, error, fnLocation }) => ({
        url: '/sendMessage',
        method: 'POST',
        body: {
          chat_id: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID,
          parse_mode: 'Markdown',
          text: `
**🚨 Error detectado en la aplicación**  
*Fecha y hora:* \`${new Date().toLocaleString()}\`

---

**Ubicación:**  
\`${location}\`

**Función:**  
\`${fnLocation}\`

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
`,
        },
      }),
    }),
  }),
});

export const { useSendMessageMutation } = errorsApi;

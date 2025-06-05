'use client';

import { useEffect } from 'react';
import { useSendMessageMutation } from '@/lib/services/telegram';

export function useErrorReport(error: Error) {
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  useEffect(() => {
    if (!error) return;
    const location = typeof window !== 'undefined' ? window.location.href : '';
    const message = `Error en ${location}\n${error.name}: ${error.message}`;
    sendMessage(message).unwrap().catch((error) => {
      console.error(error);
    });
  }, [error]);
}
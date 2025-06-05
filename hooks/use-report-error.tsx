'use client';

import { useEffect } from 'react';
import { useSendMessageMutation } from '@/lib/services/telegram';

export function useErrorReport({ error, fnLocation }: { error: Error, fnLocation?: string }) {
  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    if (!error) return;
    if (process.env.NODE_ENV !== 'production') return;
    const location = typeof window !== 'undefined' ? window.location.href : '';
    sendMessage({ location, error, fnLocation }).unwrap().catch((error) => {
      console.error(error);
    });
  }, [error]);
}
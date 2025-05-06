import React from 'react';
import { cn } from '@/lib/utils';

type options = {
  title?: string;
  margin?: number;
}

export const PDF: React.FC<{ children: React.ReactNode, options?: options, className?: string }> = ({ children, options, className }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <title>
          {options?.title || 'Documento'}
        </title>
        <base href={baseUrl} />
        <link rel="stylesheet" href="/tailwind.css" />
        <style>{`
          @page { size: A4; margin: ${options?.margin || 10}mm; }
        `}</style>
      </head>
      <body>
        <div
          className={cn("bg-white mx-auto antialiased", className)}
          style={{
            width: '794px',
            minHeight: '1122px',
            position: 'relative',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
};
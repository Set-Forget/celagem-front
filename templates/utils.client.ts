'use client'

import { TemplateMap } from "./templates";
import { generatePDFBuffer } from "./utils.server";

export async function generatePDF<K extends keyof TemplateMap>(options: {
  templateName: K;
  data: TemplateMap[K];
}): Promise<{ view: () => void; save: (filename?: string) => void }> {
  const base64 = await generatePDFBuffer(options);
  return {
    view() {
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    },
    save(filename = 'documento.pdf') {
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },
  };
}

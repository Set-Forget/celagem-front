'use client'

import { PDFDocument } from "pdf-lib";
import { TemplateMap } from "./templates";
import { generatePDFBuffer } from "./utils.server";

export async function generatePDF<K extends keyof TemplateMap>(options: {
  templateName: K
  data: TemplateMap[K]
}): Promise<{
  base64: string
  view: () => void
  save: (filename?: string) => void
}> {
  const base64 = await generatePDFBuffer(options)

  const makeBlob = () => {
    const clean = base64.includes("base64,")
      ? base64.split("base64,")[1]
      : base64

    const binary = Uint8Array.from(atob(clean), c => c.charCodeAt(0))
    return new Blob([binary], { type: "application/pdf" })
  }

  return {
    base64,
    view() {
      const url = URL.createObjectURL(makeBlob())
      window.open(url, "_blank")
    },
    save(filename = "document.pdf") {
      const url = URL.createObjectURL(makeBlob())
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    }
  }
}

export async function mergePDFs(base64List: string[]) {
  const mergedPdf = await PDFDocument.create()

  for (const b64 of base64List) {
    const cleanB64 = b64.includes("base64,") ? b64.split("base64,")[1] : b64
    const bytes = Uint8Array.from(atob(cleanB64), c => c.charCodeAt(0))
    const pdf = await PDFDocument.load(bytes)
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    pages.forEach(page => mergedPdf.addPage(page))
  }

  const mergedBytes = await mergedPdf.save()

  return {
    view() {
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      window.open(url, "_blank")
    },
    save(filename = "merged-visits.pdf") {
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    }
  }
}
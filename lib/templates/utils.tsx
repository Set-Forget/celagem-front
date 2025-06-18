import { pdf } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import type { TemplateMap } from './templates'
import { templates } from './templates'
import { PDFDocument } from "pdf-lib";
import { Provider } from 'react-redux'
import { store } from '@/store'

export interface GeneratePDFOptions<K extends keyof TemplateMap> {
  templateName: K
  data: TemplateMap[K]
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

export async function generatePDF<K extends keyof TemplateMap>(
  options: GeneratePDFOptions<K>
) {
  const { templateName, data } = options

  const TemplateComponent = templates[templateName] as React.ComponentType<{
    data: TemplateMap[K]
  }>

  if (!TemplateComponent) {
    throw new Error(`Template "${templateName}" no soportado.`)
  }

  const doc: ReactElement = (
    <Provider store={store}>
      <TemplateComponent data={data} />
    </Provider>
  )

  const instance = pdf()
  instance.updateContainer(doc)

  const blob = await instance.toBlob()

  return {
    view: () => {
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    },
    save: (filename = `${templateName}-${Date.now()}.pdf`) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
  }
}

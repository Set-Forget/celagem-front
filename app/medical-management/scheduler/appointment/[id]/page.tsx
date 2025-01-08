'use client'

import Header from "@/components/header"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from "next/navigation"

const TEMPLATES = [
  { id: 1, template: "Evaluación psicológica de aspirante a donante de óvulos", schema: "ovo-contributor" },
  { id: 2, template: "Consulta ginecológica de aspirante a donante de óvulos", schema: "ovo-contributor" },
  { id: 3, template: "Evaluación médica de la donante", schema: "ovo-contributor" },
  { id: 4, template: "Características del paciente", schema: "ovo-contributor" },
  { id: 5, template: "Resultado - exámenes laboratorios", schema: "ovo-contributor" },
  { id: 6, template: "Consulta de inicio de estimulación ovárica controlada (EOC)", schema: "ovo-contributor" },
  { id: 7, template: "2do control de estimulación ovárica controlada (EOC)", schema: "ovo-contributor" },
  { id: 8, template: "3er control de estimulación ovárica controlada (EOC)", schema: "ovo-contributor" },
  { id: 9, template: "Trigger (EOC)", schema: "ovo-contributor" },
  { id: 10, template: "Aspiración Folicular", schema: "ovo-contributor" },
  { id: 11, template: "Óvulo para Fertilización y Cultivo", schema: "ovo-contributor" },
  { id: 12, template: "Entrada al banco de óvulos por vitrificación", schema: "ovo-contributor" },
  { id: 13, template: "Salida del banco de óvulos por desvitrificación", schema: "ovo-contributor" },
  { id: 14, template: "Orden de Entrega de Medicamentos", schema: "ovo-contributor" },
  { id: 15, template: "Ordenes de Examenes de Laboratorio", schema: "ovo-contributor" },
  { id: 16, template: "Anexos", schema: "ovo-contributor" },
  { id: 17, template: "Control Médico", schema: "ovo-contributor" },
  { id: 18, template: "Nota de Embriología", schema: "ovo-contributor" },
  { id: 19, template: "Nota de Enfermería", schema: "ovo-contributor" },
  { id: 20, template: "Consulta medicina genética de aspirante a donante de óvulos", schema: "ovo-contributor" },
  { id: 21, template: "Salida del banco de óvulos por desincorporación", schema: "ovo-contributor" }
];

export default function AppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const searchParams = useSearchParams();

  const template_id = searchParams.get('template') || undefined
  const selectedTemplate = TEMPLATES.find(template => template.id.toString() === template_id)

  const handleSelectTemplate = (template_id: string) => {
    window.history.pushState({}, '', `?template=${template_id}`)
  }

  return (
    <>
      <Header title="Visita N° 123456">
        {/*         <Button className="ml-auto" size="sm">
          <Pencil className="w-4 h-4" />
          Editar cliente
        </Button> */}
      </Header>
      <ResizablePanelGroup className="flex !h-full !w-auto" direction="horizontal">
        <ResizablePanel defaultSize={70}>
          <div className="flex flex-col gap-4 py-4">
            <div className="px-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">Datos de la visita</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Profesional</label>
                  <span className="text-sm">Jhon Doe</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Tipo de atención</label>
                  <span className="text-sm">Ovo-Aportante</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Modalidad</label>
                  <span className="text-sm">Presencial</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="px-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">Datos del paciente</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Nombre</label>
                  <span className="text-sm">Juan Pérez</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Documento</label>
                  <span className="text-sm">CC 123456789</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Tipo de vinculación</label>
                  <span className="text-sm">Particular</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Sexo biologico</label>
                  <span className="text-sm">Másculino</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Identidad de género</label>
                  <span className="text-sm">Cisgénero</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Número de teléfono</label>
                  <span className="text-sm">+54 9 11 1234 5678</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Email</label>
                  <span className="text-sm">set@forget.com</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Ciudad de residencia</label>
                  <span className="text-sm">Buenos Aires</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="px-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">{selectedTemplate?.template}</h2>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle disabled />
        <ResizablePanel className="!flex-none w-fit p-4" defaultSize={30}>
          <h2 className="text-base font-medium">Plantillas</h2>
          <Tabs orientation="vertical" className="w-[300px] mt-4" onValueChange={(id) => handleSelectTemplate(id)} value={template_id}>
            <TabsList className="flex flex-col h-auto gap-1 bg-background">
              {TEMPLATES.map((template, index) => (
                <TabsTrigger value={template.id.toString()} key={index} className="w-full items-start gap-1 justify-start font-normal border bg-secondary data-[state=active]:bg-primary/25 data-[state=active]:border-primary/50 group">
                  <div className="w-4 h-4 rounded-full border shrink-0 bg-background mt-[2px] group-data-[state=active]:border-primary/50 flex items-center justify-center">
                    {false && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                  </div>
                  <p className="text-wrap text-left">{template.template}</p>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </ResizablePanel >
      </ResizablePanelGroup >
    </>
  )
}

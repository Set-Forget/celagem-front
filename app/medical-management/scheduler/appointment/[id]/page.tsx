'use client'

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useGetTemplateQuery } from "@/lib/services/templates"
import { Save, Signature } from "lucide-react"
import { useParams } from "next/navigation"
import { TemplateForm, TemplateFormHandle } from "./components/template-form"
import { useRef } from "react"

export default function AppointmentPage() {
  const params = useParams<{ id: string }>();

  const id = Number(params.id)

  const { data: template, isLoading: isTemplateLoading } = useGetTemplateQuery(9)

  const formRef = useRef<TemplateFormHandle>(null);

  return (
    <>
      <Header title="Visita N° 123456">
        <div className="flex gap-2 items-center ml-auto">
          <Button
            onClick={() => formRef.current?.submit()}
            variant="ghost"
            size="sm"
          >
            <Save />
            Guardar
          </Button>
          <Button size="sm">
            <Signature />
            Firmar visita
          </Button>
        </div>
      </Header>
      <div className="flex flex-col">
        <div className="p-4 flex flex-col gap-4">
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
        <div className="p-4 flex flex-col gap-4">
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
        {!template ? "Cargando..." : <TemplateForm template={template} ref={formRef} />}
      </div>
    </>
  )
}
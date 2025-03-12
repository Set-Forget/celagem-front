'use client'

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetTemplateQuery } from "@/lib/services/templates"
import { FileText, Save, Signature, User } from "lucide-react"
import { useParams } from "next/navigation"
import { useRef } from "react"
import { TemplateForm, TemplateFormHandle } from "./components/template-form"
import { useGetPatientQuery } from "@/lib/services/patients"
import { useGetAppointmentQuery } from "@/lib/services/appointments"
import { cn, placeholder } from "@/lib/utils"

export default function AppointmentPage() {
  const params = useParams<{ appointment_id: string }>();

  const appointmentId = params.appointment_id

  const { data: appointment, isLoading: isAppointmentLoading } = useGetAppointmentQuery(appointmentId)
  const { data: template } = useGetTemplateQuery(1)

  const patientId = appointment?.patient.id;
  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(patientId!, {
    skip: !patientId,
  });

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
        <Tabs className="mt-4" defaultValue="tab-1">
          <ScrollArea>
            <TabsList className="relative justify-start !pl-4 h-auto w-full gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
              <TabsTrigger
                value="tab-1"
                className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
              >
                <FileText
                  className="-ms-0.5 me-1.5"
                  size={16}
                  aria-hidden="true"
                />
                Visita
              </TabsTrigger>
              <TabsTrigger
                value="tab-2"
                className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
              >
                <User
                  className="-ms-0.5 me-1.5"
                  size={16}
                  aria-hidden="true"
                />
                Paciente
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="tab-1" className="m-0">
            <div className="p-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">Datos de la visita</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Profesional</label>
                  <span className="text-sm">xxxxxxx</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Tipo de atención</label>
                  <span className="text-sm">xxxxxxx</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Modalidad</label>
                  <span className="text-sm">xxxxxxx</span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="tab-2" className="m-0">
            <div className="p-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">Datos del paciente</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Nombre</label>
                  <span className={cn("text-sm transition-all duration-300", isAppointmentLoading || isPatientLoading ? "blur-[4px]" : "blur-none")}>
                    {isAppointmentLoading || isPatientLoading ? placeholder(14) : patient?.first_name + " " + patient?.first_last_name}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Documento</label>
                  <span className={cn("text-sm transition-all duration-300", isAppointmentLoading || isPatientLoading ? "blur-[4px]" : "blur-none")}>
                    {isAppointmentLoading || isPatientLoading ? placeholder(9) : "xxxxxxx"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Sexo biologico</label>
                  <span className={cn("text-sm transition-all duration-300", isAppointmentLoading || isPatientLoading ? "blur-[4px]" : "blur-none")}>
                    {isAppointmentLoading || isPatientLoading ? placeholder(9) : patient?.biological_sex}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Identidad de género</label>
                  <span className={cn("text-sm transition-all duration-300", isAppointmentLoading || isPatientLoading ? "blur-[4px]" : "blur-none")}>
                    {isAppointmentLoading || isPatientLoading ? placeholder(14) : patient?.gender_identity}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Aseguradora</label>
                  <span className={cn("text-sm transition-all duration-300", isAppointmentLoading || isPatientLoading ? "blur-[4px]" : "blur-none")}>
                    {isAppointmentLoading || isPatientLoading ? placeholder(14) : patient?.insurance_provider}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Discapacidad</label>
                  <span className={cn("text-sm transition-all duration-300", isAppointmentLoading || isPatientLoading ? "blur-[4px]" : "blur-none")}>
                    {isAppointmentLoading || isPatientLoading ? placeholder(14) : patient?.disability_type}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Número de teléfono</label>
                  <span className="text-sm">xxxxxx</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Email</label>
                  <span className="text-sm">xxxxxx</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Ciudad de residencia</label>
                  <span className="text-sm">xxxxxx</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <Separator />
        {!template ?
          <div className="p-4 flex flex-col gap-4">
            <span className={cn("text-base blur-[4px]")}>
              {placeholder(40)}
            </span>
            <div className="space-y-4">
              {[1, 2].map((section) => (
                <fieldset key={section} className="border border-input rounded-md p-4">
                  <legend className="text-xs px-2 border rounded-sm">
                    <span className="font-medium blur-[4px]">
                      {placeholder(10)}
                    </span>
                  </legend>
                  <div className="grid grid-cols-1 gap-4">
                    {[1, 2, 3].map((field) => (
                      <div key={field} className="flex flex-col gap-2">
                        <span className="text-sm blur-[4px]">
                          {placeholder(9)}
                        </span>
                        <span className="bg-accent blur-[4px] rounded-md h-9"></span>
                      </div>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </div>
          :
          <TemplateForm template={template} ref={formRef} />}
      </div>
    </>
  )
}
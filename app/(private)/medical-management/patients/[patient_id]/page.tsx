'use client'

import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import { ChevronDown, Pencil, Plus, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useParams } from "next/navigation"
import { useGetPatientQuery } from "@/lib/services/patients"
import { cn, placeholder } from "@/lib/utils"
import { format } from "date-fns"

const notes = [
  { id: 1, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc." },
  { id: 2, content: "Nullam nec purus nec nunc. ac bibendum." },
  { id: 3, content: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit" },
  { id: 4, content: "Sed pretium tortor nec ipsum interdum dictum. Aliquam erat volutpat. Phasellus pulvinar velit arcu, at interdum ligula volutpat id. Nulla et tellus vel ipsum scelerisque auctor eu non massa. Duis laoreet vel magna eu sodales. Maecenas bibendum nisl neque, quis auctor arcu pharetra commodo. Proin sit amet facilisis libero. Fusce sagittis purus ut aliquam accumsan. Fusce vel mauris nisi. Vestibulum lobortis." },
]

export default function PatientPage() {
  const params = useParams<{ patient_id: string }>();

  const patientId = params.patient_id

  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(patientId);
  return (
    <>
      <Header title="Detalles del paciente">
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                Acciones
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Ver historial
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Crear visita
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm">
            <Pencil className="w-4 h-4" />
            Editar paciente
          </Button>
        </div>
      </Header>
      <ResizablePanelGroup className="flex !h-full !w-auto" direction="horizontal">
        <ResizablePanel defaultSize={70}>
          <div className="flex flex-col gap-4 py-4">
            <div className="px-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">General</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Nombre</label>
                  <span className={cn("text-sm transition-all duration-300", isPatientLoading ? "blur-[4px]" : "blur-none")}>
                    {isPatientLoading ? placeholder(14) : patient?.first_name + " " + patient?.first_last_name}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Tipo de vinculación</label>
                  <span className="text-sm">
                    xxxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Clase</label>
                  <span className="text-sm">
                    xxxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Sexo biológico</label>
                  <span className={cn("text-sm transition-all duration-300", isPatientLoading ? "blur-[4px]" : "blur-none")}>
                    {isPatientLoading ? placeholder(14) : patient?.biological_sex}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Identidad de género
                  </label>
                  <span className={cn("text-sm transition-all duration-300", isPatientLoading ? "blur-[4px]" : "blur-none")}>
                    {isPatientLoading ? placeholder(14) : patient?.gender_identity}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Fecha de nacimiento
                  </label>
                  <span className={cn("text-sm transition-all duration-300", isPatientLoading ? "blur-[4px]" : "blur-none")}>
                    {isPatientLoading ? placeholder(14) : patient?.birth_date && format(patient?.birth_date, "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Lugar de nacimiento
                  </label>
                  <span className={cn("text-sm transition-all duration-300", isPatientLoading ? "blur-[4px]" : "blur-none")}>
                    {isPatientLoading ? placeholder(14) : patient?.birth_place}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Dirección de residencia
                  </label>
                  <span className="text-sm">
                    xxxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Discapacidad
                  </label>
                  <span className={cn("text-sm transition-all duration-300", isPatientLoading ? "blur-[4px]" : "blur-none")}>
                    {isPatientLoading ? placeholder(14) : patient?.disability_type}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Sede
                  </label>
                  <span className="text-sm">
                    xxxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Documento
                  </label>
                  <span className="text-sm">
                    xxxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Número de teléfono</label>
                  <span className="text-sm">
                    xxxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Email</label>
                  <span className="text-sm">
                    xxxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Entidad/IPS remitente
                  </label>
                  <span className={cn("text-sm transition-all duration-300", isPatientLoading ? "blur-[4px]" : "blur-none")}>
                    {isPatientLoading ? placeholder(14) : patient?.referring_entity}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Aseguradora
                  </label>
                  <span className={cn("text-sm transition-all duration-300", isPatientLoading ? "blur-[4px]" : "blur-none")}>
                    {isPatientLoading ? placeholder(14) : patient?.insurance_provider}
                  </span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="px-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">Acompañante</h2>
            </div>
            <Separator />
            <div className="px-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">Responsable</h2>
            </div>
            <Separator />
            <div className="px-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">Fiscal</h2>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle disabled />
        <ResizablePanel className="!flex-none w-[350px]" defaultSize={30}>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-medium">Notas</h2>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
              >
                <Plus />
              </Button>
            </div>
            <ScrollArea className="h-[300px] w-full pr-2 overflow-x-hidden border p-2 bg-muted !rounded-sm">
              {notes.map((note) => (
                <div key={note.id} className="flex items-start justify-between py-2 border-b last:border-b-0 group relative">
                  <p className="text-xs break-words pr-2 flex-1">{note.content}</p>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1">
                    <Button variant="outline" size="icon" className="h-6 w-6 rounded-tr-none rounded-br-none border-r-0">
                      <Pencil />
                    </Button>
                    <Button variant="outline" size="icon" className="h-6 w-6 rounded-tl-none rounded-bl-none">
                      <X />
                    </Button>
                  </div>

                </div>
              ))}
            </ScrollArea>
          </div>
          <Separator />
          <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-medium">Última visita</h2>
            </div>
          </div>
          <Separator />
          <div className="p-4 flex flex-col gap-4">
            <h2 className="text-base font-medium">Actividad</h2>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Creado por <strong className="font-medium">John Doe</strong></label>
              <span className="text-sm">Hace 3 días</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Editado por <strong className="font-medium">Jane Doe</strong></label>
              <span className="text-sm">Hace 2 días</span>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}

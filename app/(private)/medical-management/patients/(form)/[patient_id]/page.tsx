'use client'

import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useGetPatientQuery } from "@/lib/services/patients"
import { cn, placeholder } from "@/lib/utils"
import { Building, ChevronDown, Ellipsis, Hospital, House, Mail, Pencil, Plus, Shield, Users, Wallet, X } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import CareCompanyTab from "./components/care_company-tab"
import CaregiverTab from "./components/caregiver-tab"
import CompanionTab from "./components/companion-tab"
import FiscalTab from "./components/fiscal-tab"
import GeneralTab from "./components/general-tab"
import Dropdown from "@/components/dropdown"
import ContactTab from "./components/contact-tab"
import AffiliationTab from "./components/affiliation-tab"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

const notes = [
  { id: 1, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc." },
  { id: 2, content: "Nullam nec purus nec nunc. ac bibendum." },
  { id: 3, content: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit" },
  { id: 4, content: "Sed pretium tortor nec ipsum interdum dictum. Aliquam erat volutpat. Phasellus pulvinar velit arcu, at interdum ligula volutpat id. Nulla et tellus vel ipsum scelerisque auctor eu non massa. Duis laoreet vel magna eu sodales. Maecenas bibendum nisl neque, quis auctor arcu pharetra commodo. Proin sit amet facilisis libero. Fusce sagittis purus ut aliquam accumsan. Fusce vel mauris nisi. Vestibulum lobortis." },
]

const tabs = [
  {
    value: "tab-1",
    label: "Contacto",
    icon: <Mail size={16} />,
    content: <ContactTab />
  },
  {
    value: "tab-2",
    label: "Afiliación",
    icon: <Hospital size={16} />,
    content: <AffiliationTab />
  },
  {
    value: "tab-3",
    label: "Acompañante",
    icon: <Users size={16} />,
    content: <CompanionTab />
  },
  {
    value: "tab-4",
    label: "Responsable",
    icon: <Shield size={16} />,
    content: <CaregiverTab />
  },
  {
    value: "tab-5",
    label: "Empresa responsable",
    icon: <Building size={16} />,
    content: <CareCompanyTab />
  },
  {
    value: "tab-6",
    label: "Fiscal",
    icon: <Wallet size={16} />,
    content: <FiscalTab />
  },
];

export default function Page() {
  const router = useRouter()
  const params = useParams<{ patient_id: string }>();

  const patientId = params.patient_id;

  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(patientId);

  const [tab, setTab] = useState(tabs[0].value)

  return (
    <div className="flex flex-col h-full">
      <Header title="Detalles del paciente">
        <div className="ml-auto flex items-center gap-2">
          <Dropdown
            trigger={
              <Button size="icon" variant="outline" className="h-8 w-8">
                <Ellipsis />
              </Button>
            }
          >
            <DropdownMenuItem onSelect={() => router.push(`/medical-management/medical-record/${patientId}`)} >
              Ver historial
            </DropdownMenuItem>
            <DropdownMenuItem>
              Crear visita
            </DropdownMenuItem>
          </Dropdown>
          <Button
            onClick={() => router.push(`/medical-management/patients/${patientId}/edit`)}
            size="sm"
          >
            <Pencil className="w-4 h-4" />
            Editar paciente
          </Button>
        </div>
      </Header>
      <ResizablePanelGroup className="flex !h-full !w-full" direction="horizontal">
        <ResizablePanel defaultSize={70}>
          <GeneralTab />
          <DataTabs
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            contentClassName="p-4"
          />
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
              xxxx
            </div>
          </div>
          <Separator />
          <div className="p-4 flex flex-col gap-4">
            <h2 className="text-base font-medium">Actividad</h2>
            {(!isPatientLoading && patient?.created_by) &&
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">
                  Creado por{" "}
                  <span className="font-medium">
                    {isPatientLoading ? placeholder(13) : patient?.created_by?.first_name + " " + patient?.created_by?.last_name}
                  </span>
                </label>
                <span
                  className={cn(
                    "text-sm transition-all duration-300",
                    isPatientLoading ? "blur-[4px]" : "blur-none"
                  )}
                >
                  {isPatientLoading ? placeholder(13) : formatDistanceToNow(patient?.created_at, { addSuffix: true, locale: es })}
                </span>
              </div>
            }
            {(!isPatientLoading && patient?.updated_by) &&
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">
                  Editado por{" "}
                  <span className={cn(
                    "font-medium transition-all duration-300",
                    isPatientLoading ? "blur-[4px]" : "blur-none"
                  )}>
                    {isPatientLoading ? placeholder(13) : patient?.updated_by?.first_name + " " + patient?.updated_by?.last_name}
                  </span>
                </label>
                <span
                  className={cn(
                    "text-sm transition-all duration-300",
                    isPatientLoading ? "blur-[4px]" : "blur-none"
                  )}
                >
                  {isPatientLoading ? placeholder(13) : formatDistanceToNow(patient?.updated_at, { addSuffix: true, locale: es })}
                </span>
              </div>
            }
            {(!isPatientLoading && !patient?.created_by && !patient?.updated_by) && <span className="text-muted-foreground text-sm">No hay actividad</span>}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

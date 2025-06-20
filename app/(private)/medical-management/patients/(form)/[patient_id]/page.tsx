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
          <Button
            onClick={() => router.push(`/medical-management/patients/${patientId}/edit`)}
            size="sm"
          >
            <Pencil className="w-4 h-4" />
            Editar paciente
          </Button>
        </div>
      </Header>
      <GeneralTab />
      <DataTabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        contentClassName="p-4"
      />
    </div>
  )
}

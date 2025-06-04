'use client'

import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { useGetAppointmentQuery } from "@/lib/services/appointments"
import { useGetTemplateQuery } from "@/lib/services/templates"
import { useGetVisitQuery } from "@/lib/services/visits"
import { cn, placeholder } from "@/lib/utils"
import { Puzzle, User } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { visitStatus } from "../../utils"
import Actions from "./actions"
import AppointmentTab from "./components/appointment-tab"
import PatientTab from "./components/patient-tab"
import TemplateTab from "./components/template-tab"

const tabs = [
  {
    value: "tab-1",
    label: "Plantilla",
    icon: <Puzzle size={16} />,
    content: <TemplateTab />
  },
  {
    value: "tab-2",
    label: "Paciente",
    icon: <User size={16} />,
    content: <PatientTab />
  },
];

export default function Page() {
  const [tab, setTab] = useState(tabs[0].value);

  const params = useParams<{ visit_id: string }>();

  const visitId = params.visit_id

  const { data: visit, isLoading: isVisitLoading } = useGetVisitQuery(visitId)

  const status = visitStatus[visit?.status as keyof typeof visitStatus]

  return (
    <div>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isVisitLoading ? "blur-[4px]" : "blur-none")}>
          Visita N° {isVisitLoading ? placeholder(3, true) : visit?.visit_number}
        </h1>
      }>
        <div className="mr-auto">
          <Badge
            variant="custom"
            className={cn(`${status?.bg_color} ${status?.text_color} border-none rounded-sm`)}
          >
            {status?.label}
          </Badge>
        </div>
        <Actions state={visit?.status} />
      </Header>
      <div className="flex flex-col">
        <AppointmentTab />
        <DataTabs
          tabs={tabs}
          activeTab={tab}
          onTabChange={setTab}
          triggerClassName="mt-4"
        />
      </div>
    </div>
  )
}

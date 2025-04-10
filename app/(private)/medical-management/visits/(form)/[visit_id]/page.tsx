'use client'

import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useGetAppointmentQuery } from "@/lib/services/appointments"
import { useGetTemplateQuery } from "@/lib/services/templates"
import { useGetVisitQuery } from "@/lib/services/visits"
import { cn, placeholder } from "@/lib/utils"
import { FileText, User } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { visitStatus } from "../../utils"
import Actions from "./actions"
import { TemplateView } from "./components/template-view"
import VisitTab from "./components/visit-tab"
import PatientTab from "./components/patient-tab"

const tabs = [
  {
    value: "tab-1",
    label: "Visita",
    icon: <FileText className="mr-1.5" size={16} />,
    content: <VisitTab />
  },
  {
    value: "tab-2",
    label: "Paciente",
    icon: <User className="mr-1.5" size={16} />,
    content: <PatientTab />
  },
];

export default function Page() {
  const [tab, setTab] = useState(tabs[0].value);

  const params = useParams<{ visit_id: string }>();

  const visitId = params.visit_id

  const { data: visit, isLoading: isVisitLoading } = useGetVisitQuery(visitId)
  const { data: appointment } = useGetAppointmentQuery(visit?.appointment_id!, { skip: !visit?.appointment_id })
  const { data: template } = useGetTemplateQuery(appointment?.template.id!, { skip: !appointment?.template })

  const status = visitStatus[visit?.status as keyof typeof visitStatus];

  return (
    <div>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isVisitLoading ? "blur-[4px]" : "blur-none")}>
          {isVisitLoading ? placeholder(3, true) : visit?.visit_number}
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
        <DataTabs
          tabs={tabs}
          activeTab={tab}
          onTabChange={setTab}
          triggerClassName="mt-4"
          contentClassName="p-4"
        />
        <Separator />
        {(!template || !visit) ? (
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
        ) : (
          <TemplateView
            template={template}
            data={visit.medical_record}
          />
        )}
      </div>
    </div>
  )
}

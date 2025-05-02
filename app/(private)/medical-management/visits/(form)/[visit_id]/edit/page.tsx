"use client";

import { TemplateDetail } from "@/app/(private)/medical-management/(masters)/schemas/templates";
import CustomSonner from "@/components/custom-sonner";
import DataTabs from "@/components/data-tabs";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useGetVisitQuery, useUpdateVisitMutation } from "@/lib/services/visits";
import { cn, placeholder } from "@/lib/utils";
import { Puzzle, Save, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { TemplateFormHandle } from "../../new/components/template-form";
import AppointmentTab from "../components/appointment-tab";
import PatientTab from "../components/patient-tab";
import TemplateFormTab from "../components/template-form-tab";

export default function Page() {
  const router = useRouter();

  const [tab, setTab] = useState("tab-1");
  const [template, setTemplate] = useState<TemplateDetail | undefined>(undefined)
  const [initialData, setInitialData] = useState<Record<string, any> | undefined>(undefined)

  const params = useParams<{ visit_id: string }>();
  const visitId = params.visit_id;

  const { data: visit, isLoading: isVisitLoading } = useGetVisitQuery(visitId!, { skip: !visitId })

  const [updateVisit, { isLoading: isUpdatingVisit }] = useUpdateVisitMutation();

  const formRef = useRef<TemplateFormHandle>(null);

  const handleSubmit = async (formData: any, templateName: string) => {
    if (!visit?.appointment_id) {
      return console.warn("No se ha podido obtener el id del turno");
    }

    try {
      const response = await updateVisit({
        id: visitId!,
        body: {
          medical_record: {
            name: templateName,
            data: JSON.stringify({
              template,
              formData,
            }),
          },
        },
      }).unwrap();

      if (response.status === "SUCCESS") {
        router.push(`/medical-management/visits/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Visita actualizada exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar la visita" variant="error" />)
    }
  };

  const tabs = [
    {
      value: "tab-1",
      label: "Plantilla",
      icon: <Puzzle className="mr-1.5" size={16} />,
      content: <TemplateFormTab formRef={formRef} onSubmit={handleSubmit} template={template!} initialData={initialData} />
    },
    {
      value: "tab-2",
      label: "Paciente",
      icon: <User className="mr-1.5" size={16} />,
      content: <PatientTab />
    },
  ];

  useEffect(() => {
    if (!visit) return;

    const { template, formData } = JSON.parse(visit.medical_record ?? "{}");

    setTemplate(template);
    setInitialData(formData);
  }, [visit]);

  return (
    <div>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isVisitLoading ? "blur-[4px]" : "blur-none")}>
          Editar visita N° {isVisitLoading ? placeholder(3, true) : visit?.visit_number}
        </h1>
      }>
        <div className="flex gap-2 items-center ml-auto">
          <Button
            onClick={() => formRef.current?.submit()}
            size="sm"
            loading={isUpdatingVisit}
          >
            <Save className={cn(isUpdatingVisit && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header >
      <div className="flex flex-col">
        <AppointmentTab />
        <DataTabs
          tabs={tabs}
          activeTab={tab}
          onTabChange={setTab}
          triggerClassName="mt-4"
        />
      </div>
    </div >
  );
}

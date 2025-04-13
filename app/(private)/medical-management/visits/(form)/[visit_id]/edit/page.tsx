

"use client";

import CustomSonner from "@/components/custom-sonner";
import DataTabs from "@/components/data-tabs";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetAppointmentQuery } from "@/lib/services/appointments";
import { useGetTemplateQuery } from "@/lib/services/templates";
import { useGetVisitQuery, useUpdateVisitMutation } from "@/lib/services/visits";
import { cn, placeholder } from "@/lib/utils";
import { FileText, Save, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { TemplateForm, TemplateFormHandle } from "../../components/template-form";
import PatientTab from "../components/patient-tab";
import AppointmentTab from "../components/appointment-tab";

const tabs = [
  {
    value: "tab-1",
    label: "Turno",
    icon: <FileText className="mr-1.5" size={16} />,
    content: <AppointmentTab />,
  },
  {
    value: "tab-2",
    label: "Paciente",
    icon: <User className="mr-1.5" size={16} />,
    content: <PatientTab />,
  },
];

export default function Page() {
  const router = useRouter();

  const [tab, setTab] = useState(tabs[0].value);
  const formRef = useRef<TemplateFormHandle>(null);

  const params = useParams<{ visit_id: string }>();
  const visitId = params.visit_id;

  const { data: visit, isLoading: isVisitLoading } = useGetVisitQuery(visitId!, { skip: !visitId })
  const { data: appointment } = useGetAppointmentQuery(visit?.appointment_id!, { skip: !visit?.appointment_id });
  const { data: template } = useGetTemplateQuery(appointment?.template.id!, {
    skip: !appointment?.template.id,
  });

  const [updateVisit, { isLoading: isUpdatingVisit }] = useUpdateVisitMutation();

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
            data: JSON.stringify(formData),
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

  useEffect(() => {
    if (visit && template && formRef.current) {
      const visitData = JSON.parse(visit.medical_record ?? "{}") as Record<string, any>;
      formRef.current.reset(visitData);
    }
  }, [visit, template]);

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
        <DataTabs
          tabs={tabs}
          activeTab={tab}
          onTabChange={setTab}
          triggerClassName="mt-4"
          contentClassName="p-4"
        />
        <Separator />
        {!template ? (
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
          <TemplateForm template={template} onSubmit={handleSubmit} ref={formRef} />
        )}
      </div>
    </div >
  );
}

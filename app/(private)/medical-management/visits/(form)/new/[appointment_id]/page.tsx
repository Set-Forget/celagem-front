"use client";

import CustomSonner from "@/components/custom-sonner";
import DataTabs from "@/components/data-tabs";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useGetAppointmentQuery, useUpdateAppointmentMutation } from "@/lib/services/appointments";
import { useCreateVisitMutation } from "@/lib/services/visits";
import { cn } from "@/lib/utils";
import { Puzzle, Save, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import AppointmentTab from "../components/appointment-tab";
import PatientTab from "../components/patient-tab";
import { TemplateFormHandle } from "../components/template-form";
import TemplateFormTab from "../components/template-form-tab";
import { useGetTemplateQuery } from "@/lib/services/templates";

export default function Page() {
  const router = useRouter();

  const [tab, setTab] = useState("tab-1");
  const formRef = useRef<TemplateFormHandle>(null);

  const params = useParams<{ appointment_id: string }>();
  const appointmentId = params.appointment_id;

  const { data: appointment } = useGetAppointmentQuery(appointmentId!, { skip: !appointmentId });
  const { data: template } = useGetTemplateQuery(appointment?.template.id!, {
    skip: !appointment?.template.id,
  });

  const [createVisit, { isLoading: isCreatingVisit }] = useCreateVisitMutation();
  const [updateAppointment] = useUpdateAppointmentMutation()

  const handleSubmit = async (formData: any, templateName: string) => {
    try {
      const response = await createVisit({
        appointment_id: appointmentId!,
        medical_record: {
          name: templateName,
          data: JSON.stringify({
            template,
            formData,
          }),
        },
      }).unwrap();

      if (response.status === "SUCCESS") {
        router.push(`/medical-management/visits/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Visita creada exitosamente" />)

        await updateAppointment({ id: appointment?.id as string, body: { status: "COMPLETED" } }).unwrap()
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la visita" variant="error" />)
    }
  };

  const tabs = [
    {
      value: "tab-1",
      label: "Plantilla",
      icon: <Puzzle size={16} />,
      content: <TemplateFormTab formRef={formRef} onSubmit={handleSubmit} />
    },
    {
      value: "tab-2",
      label: "Paciente",
      icon: <User size={16} />,
      content: <PatientTab />
    },
  ];

  return (
    <div>
      <Header title="Nueva visita">
        <div className="flex gap-2 items-center ml-auto">
          <Button
            onClick={() => formRef.current?.submit()}
            size="sm"
            loading={isCreatingVisit}
          >
            <Save className={cn(isCreatingVisit && "hidden")} />
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
        />
      </div>
    </div >
  );
}

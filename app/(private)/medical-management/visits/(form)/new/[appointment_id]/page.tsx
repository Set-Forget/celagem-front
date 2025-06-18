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
import { useGetTemplateQuery, useUploadFileMutation } from "@/lib/services/templates";
import { useSendMessageMutation } from "@/lib/services/telegram";

export default function Page() {
  const router = useRouter();

  const [tab, setTab] = useState("tab-1");
  const formRef = useRef<TemplateFormHandle>(null);

  const params = useParams<{ appointment_id: string }>();
  const appointmentId = params.appointment_id;

  const [sendMessage] = useSendMessageMutation()
  const [createVisit, { isLoading: isCreatingVisit }] = useCreateVisitMutation();
  const [updateAppointment] = useUpdateAppointmentMutation()
  const [uploadFile, { isLoading: isUploadingFile }] = useUploadFileMutation()

  const { data: appointment } = useGetAppointmentQuery(appointmentId!, { skip: !appointmentId });
  const { data: template } = useGetTemplateQuery(appointment?.template.id!, {
    skip: !appointment?.template.id,
  });

  const handleSubmit = async (formData: any, templateName: string) => {
    const fileToBase64 = (file: File) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    };

    const processData = async (data: any): Promise<any> => {
      if (data instanceof File) {
        const TEN_MB = 10 * 1024 * 1024;
        if (data.size > TEN_MB) {
          toast.custom((t) => (
            <CustomSonner
              t={t}
              description={`File "${data.name}" exceeds the maximum size of 10 MB`}
              variant="warning"
            />
          ));
          throw new Error("File too large");
        }

        try {
          const dataUrl = await fileToBase64(data);
          const base64 = dataUrl.split(',')[1] ?? dataUrl;
          const uploadResponse = await uploadFile({ name: data.name, file: base64, ref_metadata: { dataUrl } }).unwrap();
          return { id: uploadResponse.data.id, name: data.name };
        } catch (e) {
          throw e;
        }
      }

      if (Array.isArray(data)) {
        const processedArray = [] as any[];
        for (const item of data) {
          processedArray.push(await processData(item));
        }
        return processedArray;
      }

      if (data !== null && typeof data === "object") {
        const processedObj: any = {};
        for (const key of Object.keys(data)) {
          processedObj[key] = await processData(data[key]);
        }
        return processedObj;
      }

      return data;
    };

    try {
      const processedFormData = await processData(formData);

      const response = await createVisit({
        appointment_id: appointmentId!,
        medical_record: {
          name: templateName,
          data: JSON.stringify({
            template,
            formData: processedFormData,
          }),
        },
      }).unwrap();

      if (response.status === "SUCCESS") {
        router.push(`/medical-management/visits/${response.data.id}`);
        toast.custom((t) => (
          <CustomSonner t={t} description="Visita creada exitosamente" />
        ));

        await updateAppointment({
          id: appointment?.id as string,
          body: { status: "COMPLETED" },
        }).unwrap();
      }
    } catch (error) {
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Ocurrió un error al crear la visita"
          variant="error"
        />
      ));
      sendMessage({
        location: "app/(private)/medical-management/visits/(form)/new/[appointment_id]/page.tsx",
        rawError: error,
        fnLocation: "handleSubmit",
      });
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
            loading={isCreatingVisit || isUploadingFile}
          >
            <Save className={cn((isCreatingVisit || isUploadingFile) && "hidden")} />
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
          contentClassName={cn("data-[state=inactive]:hidden")}
          forceMount
        />
      </div>
    </div >
  );
}

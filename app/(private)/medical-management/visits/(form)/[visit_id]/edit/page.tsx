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
import { useSendMessageMutation } from "@/lib/services/telegram";
import { useGetFileMutation, useUploadFileMutation } from "@/lib/services/templates";

export default function Page() {
  const router = useRouter();

  const [tab, setTab] = useState("tab-1");
  const [template, setTemplate] = useState<TemplateDetail | undefined>(undefined)
  const [initialData, setInitialData] = useState<Record<string, any> | undefined>(undefined)

  const params = useParams<{ visit_id: string }>();
  const visitId = params.visit_id;

  const [sendMessage] = useSendMessageMutation()
  const [updateVisit, { isLoading: isUpdatingVisit }] = useUpdateVisitMutation();
  const [getFile] = useGetFileMutation();
  const [uploadFile, { isLoading: isUploadingFile }] = useUploadFileMutation();

  const { data: visit, isLoading: isVisitLoading } = useGetVisitQuery(visitId!, { skip: !visitId })

  const formRef = useRef<TemplateFormHandle>(null);

  const handleSubmit = async (formData: any, templateName: string) => {
    if (!visit?.appointment_id) {
      return console.warn("No se ha podido obtener el id del turno");
    }

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
      const response = await updateVisit({
        id: visitId!,
        body: {
          medical_record: {
            name: templateName,
            data: JSON.stringify({
              template,
              formData: processedFormData,
            }),
          },
        },
      }).unwrap();

      if (response.status === "SUCCESS") {
        router.push(`/medical-management/visits/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Visita actualizada exitosamente" />)
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar la visita" variant="error" />)
      sendMessage({
        location: "app/(private)/medical-management/visits/(form)/[visit_id]/edit/page.tsx",
        rawError: error,
        fnLocation: "handleSubmit"
      })
    }
  };

  const tabs = [
    {
      value: "tab-1",
      label: "Plantilla",
      icon: <Puzzle size={16} />,
      content: <TemplateFormTab formRef={formRef} onSubmit={handleSubmit} template={template!} initialData={initialData} />
    },
    {
      value: "tab-2",
      label: "Paciente",
      icon: <User size={16} />,
      content: <PatientTab />
    },
  ];

  useEffect(() => {
    (async () => {
      if (!visit) return;

      const { template, formData } = JSON.parse(visit.medical_record ?? "{}");

      const fileFields = template.sections.flatMap((section: any) =>
        section.fields.filter((field: any) => field.type.primitive_type === "file")
      );
      const fileCodes = fileFields.map((field: any) => field.code);

      const fileIds = fileCodes
        .map((code: string) => formData?.[code]?.id)
        .filter(Boolean);

      const stringToFile = async (fileString: string, fileName: string): Promise<File> => {
        if (fileString.startsWith("data:")) {
          const [meta, base64Data] = fileString.split(",");
          const mimeMatch = meta.match(/data:(.*);base64/);
          const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
          const cleaned = base64Data.replace(/\s/g, ""); // remove whitespace/newlines
          const byteString = atob(cleaned);
          const uint8 = Uint8Array.from(byteString, (c) => c.charCodeAt(0));
          return new File([uint8], fileName, { type: mime });
        }

        const base64Regex = /^[A-Za-z0-9+/=\s]+$/;
        if (base64Regex.test(fileString)) {
          const cleaned = fileString.replace(/\s/g, "");
          const byteString = atob(cleaned);
          const uint8 = Uint8Array.from(byteString, (c) => c.charCodeAt(0));
          const ext = fileName.split(".").pop()?.toLowerCase();
          const mimeMap: Record<string, string> = {
            pdf: "application/pdf",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
          };
          const mime = mimeMap[ext || ""] || "application/octet-stream";
          return new File([uint8], fileName, { type: mime });
        }

        try {
          const res = await fetch(fileString);
          const blob = await res.blob();
          return new File([blob], fileName, { type: blob.type || "application/octet-stream" });
        } catch (e) {
          console.error("Failed to fetch file from url", e);
          return new File([], fileName);
        }
      };

      if (fileIds.length) {
        try {
          const response = await getFile({ ids: fileIds }).unwrap();
          const filesData = Array.isArray(response.data) ? response.data : [response.data];

          const fileEntries: [string, File][] = await Promise.all(
            filesData.map(async (f: any) => [f.id, await stringToFile(f.ref_metadata.file, f.name)] as [string, File])
          );
          const fileMap = new Map<string, File>(fileEntries);

          fileCodes.forEach((code: string) => {
            const current = formData[code];
            if (current?.id && fileMap.has(current.id)) {
              formData[code] = fileMap.get(current.id);
            }
          });
        } catch (error) {
          console.error("Error fetching files", error);
        }
      }
      setTemplate(template);
      setInitialData(formData);
    })();
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
            loading={isUpdatingVisit || isUploadingFile}
          >
            <Save className={cn((isUpdatingVisit || isUploadingFile) && "hidden")} />
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

import { Field, Section, TemplateDetail, templateDetailSchema } from "@/app/(private)/medical-management/(masters)/schemas/templates";
import { DataTable } from "@/components/data-table";
import { cn } from "@/lib/utils";
import { CalendarDate, CalendarDateTime } from "@internationalized/date";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";
import { useGetFileMutation } from "@/lib/services/templates";
import { toast } from "sonner";
import CustomSonner from "@/components/custom-sonner";

type FieldRenderFunction = (field: Field, rawValue: any) => React.ReactNode;

const fieldRenderers: Record<string, FieldRenderFunction> = {
  select: (field, rawValue) => {
    const option = field.type?.properties.options?.find(o => o.value === rawValue);
    return option?.label ?? "";
  },
  multiselect: (field, rawValue) => {
    if (!Array.isArray(rawValue)) return "";
    const labels = rawValue.map((value: any) => {
      const option = field.type?.properties.options?.find(o => o.value === value);
      return option?.label ?? value;
    });
    return labels.join(", ");
  },
  default: (_, rawValue) => renderValue(rawValue),
};

export const resolveFieldDisplayValue = (field: Field, rawValue: any): React.ReactNode => {
  const type = field.type?.primitive_type;
  const renderer = fieldRenderers[type] ?? fieldRenderers.default;
  return renderer(field, rawValue);
};

const formatCalendarValue = (value: any) => {
  const { year, month, day, hour, minute } = value;

  if (hour === undefined || minute === undefined) {
    return format(new CalendarDate(year, month, day).toString(), "PP", { locale: es });
  }

  return format(new CalendarDateTime(year, month, day, hour, minute).toString(), "PP hh:mmaaa", { locale: es });
};

const formatHourValue = (value: any) => {
  const { hour, minute } = value;
  return format(new Date(0, 0, 0, hour, minute), "hh:mmaaa", { locale: es });
};

const FileLink: React.FC<{ id: string; name?: string }> = ({ id, name }) => {
  const [getFile, { isLoading }] = useGetFileMutation();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await getFile({ ids: [id] }).unwrap();
      const fileData = Array.isArray(response.data) ? response.data[0] : response.data;
      const dataUrl = fileData.ref_metadata?.dataUrl || fileData.ref_metadata?.file;
      if (!dataUrl) {
        throw new Error("No dataUrl returned");
      }

      let urlToOpen = dataUrl as string;

      if (!urlToOpen.startsWith("data:")) {
        const getMimeTypeFromName = (fileName?: string) => {
          const extension = fileName?.split(".").pop()?.toLowerCase();
          switch (extension) {
            case "pdf":
              return "application/pdf";
            case "jpg":
            case "jpeg":
              return "image/jpeg";
            case "png":
              return "image/png";
            default:
              return "application/octet-stream";
          }
        };
        const mimeType = fileData.ref_metadata?.mimeType || getMimeTypeFromName(fileData.name);
        urlToOpen = `data:${mimeType};base64,${urlToOpen}`;
      }

      const shouldConvertToBlob = urlToOpen.length > 1_000_000 || urlToOpen.includes("application/pdf");
      if (shouldConvertToBlob) {
        try {
          const blob = await fetch(urlToOpen).then((r) => r.blob());
          urlToOpen = URL.createObjectURL(blob);
        } catch (e) {
          console.error("Failed to convert to blob", e);
        }
      }

      window.open(urlToOpen, "_blank");
    } catch (error) {
      console.error(error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Ocurrió un error al obtener el archivo"
          variant="error"
        />
      ));
    }
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className={cn(isLoading && "opacity-60 pointer-events-none", "text-primary underline")}
    >
      {name ?? "Ver archivo"}
    </a>
  );
};

const renderFileLink = (value: any) => {
  if (value.url) {
    const { url, name } = value;
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {name ?? "Ver archivo"}
      </a>
    );
  }

  if (value.id) {
    return <FileLink id={value.id} name={value.name} />;
  }

  return null;
};

const renderIMCInfo = (value: any) => (
  <div className="flex gap-2">
    <span><span className="font-medium">Altura:</span> {value.height} cm</span>
    <span><span className="font-medium">Peso:</span> {value.weight} kg</span>
    <span><span className="font-medium">IMC:</span> {value.imc}</span>
  </div>
);

export const renderValue = (value: any): React.ReactNode => {
  if (!value) return "";

  if (["string", "number", "boolean"].includes(typeof value)) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    if (value.url || value.id) return renderFileLink(value);
    if (value.calendar) return formatCalendarValue(value);
    if (value.hour !== undefined && value.minute !== undefined) return formatHourValue(value);
    if (value.imc !== undefined) return renderIMCInfo(value);

    return (
      <pre className="whitespace-pre-wrap break-all text-xs bg-gray-50 rounded p-2">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  return String(value);
};

const SectionFields = ({ section, medicalRecord }: { section: Section; medicalRecord: { template: TemplateDetail, formData: Record<string, any> } }) => (
  <>
    {section.fields.map((field: Field) => {
      const rawValue = medicalRecord.formData[field.code];
      const displayValue = resolveFieldDisplayValue(field, rawValue);
      return (
        <div key={field.id} className="flex flex-col gap-2">
          <label className="text-muted-foreground text-sm">{field.title}</label>
          <span className="text-sm">{displayValue}</span>
        </div>
      );
    })}
  </>
);

const SectionTable = ({ section, medicalRecord }: { section: Section; medicalRecord: { template: TemplateDetail, formData: Record<string, any> } }) => (
  <DataTable
    data={medicalRecord.formData[section.name] ?? []}
    columns={section.fields.map((field: Field) => ({
      accessorFn: (row: Record<string, any>) => row[field.code],
      id: field.code,
      header: field.title,
      cell: (info) =>
        resolveFieldDisplayValue(field, info.getValue()),
    }))}
    pagination={false}
  />
);

export const TemplateView = ({ data }: { data: string }) => {
  const medicalRecord = JSON.parse(data ?? "{}") as { template: TemplateDetail, formData: Record<string, any> };
  const parsedTemplate = templateDetailSchema.parse(medicalRecord.template);

  return (
    <div className="flex flex-col gap-4 p-4">
      <span className="text-base font-medium">{parsedTemplate.name}</span>

      {parsedTemplate.sections.map((section: Section) => (
        <div key={section.id} className="flex flex-col gap-4">
          <fieldset className={cn("border border-input rounded-md p-4 !shadow-sm min-w-0 w-full flex flex-col gap-4")}>
            {section.name && (
              <legend className="text-xs px-2 border rounded-sm font-medium">
                {section.name}
              </legend>
            )}
            {section.type === "table"
              ? <SectionTable section={section} medicalRecord={medicalRecord} />
              : <SectionFields section={section} medicalRecord={medicalRecord} />}
          </fieldset>
        </div>
      ))}
    </div>
  );
};

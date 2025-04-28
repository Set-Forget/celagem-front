import { useGetAppointmentQuery } from "@/lib/services/appointments";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useGetVisitQuery } from "@/lib/services/visits";
import { AppointmentDetail } from "@/app/(private)/medical-management/calendar/schemas/appointments";
import { modesOfCare } from "@/app/(private)/medical-management/calendar/utils";

export default function AppointmentTab() {
  const params = useParams<{ visit_id: string }>();

  const visitId = params.visit_id

  const { data: visit, isLoading: isVisitLoading } = useGetVisitQuery(visitId)
  const { data: appointment, isLoading: isAppointmentLoading } = useGetAppointmentQuery(visit?.appointment_id!, { skip: !visit?.appointment_id })

  const fields: FieldDefinition<AppointmentDetail>[] = [
    {
      label: "Fecha de inicio",
      placeholderLength: 14,
      getValue: (p) => p?.start_date ? format(new Date(`${p?.start_date} ${p?.start_time}`), "PPP hh:mmaaa", { locale: es }) : "No especificada",
    },
    {
      label: "Fecha de fin",
      placeholderLength: 14,
      getValue: (p) => p?.start_date ? format(new Date(`${p.end_date} ${p.end_time}`), "PPP hh:mmaaa", { locale: es }) : "No especificada",
    },
    {
      label: "Profesional",
      placeholderLength: 10,
      getValue: (p) => p?.doctor?.first_name + " " + p?.doctor?.last_name,
    },
    {
      label: "Tipo de atención",
      placeholderLength: 10,
      getValue: (p) => p?.template?.name,
    },
    {
      label: "Sede",
      placeholderLength: 20,
      getValue: (p) => p?.clinic?.name || "No especificada",
    },
    {
      label: "Modo de atención",
      placeholderLength: 20,
      getValue: (p) => p?.mode_of_care ? modesOfCare[p.mode_of_care as keyof typeof modesOfCare] : "No especificado",
    },
    {
      label: "Firmado por",
      placeholderLength: 10,
      className: visit?.status === "DRAFT" ? "hidden" : "",
      getValue: (p) => "xxxx",
    },
    {
      label: "Fecha de firma",
      placeholderLength: 10,
      className: visit?.status === "DRAFT" ? "hidden" : "",
      getValue: (p) => visit?.signed_at ? format(new Date(visit?.signed_at), "PPP", { locale: es }) : "No especificado",
    },
    {
      label: "Notas",
      placeholderLength: 20,
      getValue: (p) => p?.notes || "No hay notas para mostrar",
      className: "col-span-2",
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {fields.map((field) => {
        const displayValue = isVisitLoading || isAppointmentLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(appointment!) ?? "";
        return (
          <div
            className={cn("flex flex-col gap-1", field.className)}
            key={field.label}
          >
            <label className="text-muted-foreground text-sm">
              {field.label}
            </label>
            <span
              className={cn(
                "text-sm transition-all duration-300",
                isVisitLoading || isAppointmentLoading ? "blur-[4px]" : "blur-none"
              )}
            >
              {displayValue}
            </span>
          </div>
        );
      })}
    </div>
  );
}
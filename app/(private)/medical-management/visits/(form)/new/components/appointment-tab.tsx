import { useGetAppointmentQuery } from "@/lib/services/appointments";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useParams } from "next/navigation";
import { AppointmentDetail } from "../../../../calendar/schemas/appointments";
import { modesOfCare } from "../../../../calendar/utils";

export default function AppointmentTab() {
  const params = useParams<{ appointment_id: string }>();

  const appointmentId = params.appointment_id

  const { data: appointment, isLoading: isAppointmentLoading } = useGetAppointmentQuery(appointmentId!, { skip: !appointmentId })

  const fields: FieldDefinition<AppointmentDetail>[] = [
    {
      label: "Fecha de inicio",
      placeholderLength: 14,
      getValue: (p) => p?.start_date ? format(new Date(`${p?.start_date} ${p?.start_time}`), "PP hh:mmaaa", { locale: es }) : "No especificada",
    },
    {
      label: "Fecha de fin",
      placeholderLength: 14,
      getValue: (p) => p?.start_date ? format(new Date(`${p.end_date} ${p.end_time}`), "PP hh:mmaaa", { locale: es }) : "No especificada",
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
      label: "Notas",
      placeholderLength: 20,
      getValue: (p) => p?.notes || "No hay notas para mostrar",
      className: "col-span-2",
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {fields.map((field) => {
        const displayValue = isAppointmentLoading
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
                isAppointmentLoading ? "blur-[4px]" : "blur-none"
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
import { useGetAppointmentQuery } from "@/lib/services/appointments";
import { cn, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { FieldDefinition } from "../../../patients/[patient_id]/components/general-tab";
import { AppointmentDetail } from "../../../scheduler/schemas/appointments";
import { modesOfCare } from "../../../scheduler/utils";

export default function VisitTab() {
  const params = useParams<{ appointment_id: string }>();

  const appointmentId = params.appointment_id
  const { data: appointment, isLoading: isAppointmentLoading } = useGetAppointmentQuery(appointmentId)

  const fields: FieldDefinition<AppointmentDetail>[] = [
    {
      label: "Profesional",
      placeholderLength: 14,
      getValue: (a) => a.doctor.first_name + " " + a.doctor.last_name,
    },
    {
      label: "Sede",
      placeholderLength: 14,
      getValue: (a) => a.clinic.name,
    },
    {
      label: "Modo de atención",
      placeholderLength: 14,
      getValue: (a) => modesOfCare[a.mode_of_care as keyof typeof modesOfCare],
    },
    {
      label: "Notas",
      placeholderLength: 14,
      getValue: (a) => a.notes || "No hay notas",
      className: "col-span-2",
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
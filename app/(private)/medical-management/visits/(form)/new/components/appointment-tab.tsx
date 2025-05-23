import { useGetAppointmentQuery } from "@/lib/services/appointments";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useParams } from "next/navigation";
import { AppointmentDetail } from "../../../../calendar/schemas/appointments";
import { modesOfCare } from "../../../../calendar/utils";
import RenderFields from "@/components/render-fields";

export default function AppointmentTab() {
  const params = useParams<{ appointment_id: string }>();

  const appointmentId = params.appointment_id

  const { data: appointment, isLoading: isAppointmentLoading } = useGetAppointmentQuery(appointmentId!, { skip: !appointmentId })

  const fields: FieldDefinition<AppointmentDetail>[] = [
    {
      label: "Fecha de inicio",
      placeholderLength: 14,
      render: (p) => p?.start_date ? format(new Date(`${p?.start_date} ${p?.start_time}`), "PP hh:mmaaa", { locale: es }) : "No especificada",
    },
    {
      label: "Fecha de fin",
      placeholderLength: 14,
      render: (p) => p?.start_date ? format(new Date(`${p.end_date} ${p.end_time}`), "PP hh:mmaaa", { locale: es }) : "No especificada",
    },
    {
      label: "Profesional",
      placeholderLength: 10,
      render: (p) => p?.doctor?.first_name + " " + p?.doctor?.last_name,
    },
    {
      label: "Tipo de atención",
      placeholderLength: 10,
      render: (p) => p?.template?.name,
    },
    {
      label: "Sede",
      placeholderLength: 20,
      render: (p) => p?.clinic?.name || "No especificada",
    },
    {
      label: "Modo de atención",
      placeholderLength: 20,
      render: (p) => p?.mode_of_care ? modesOfCare[p.mode_of_care as keyof typeof modesOfCare] : "No especificado",
    },
    {
      label: "Notas",
      placeholderLength: 20,
      render: (p) => p?.notes || "No hay notas para mostrar",
      className: "col-span-2",
    }
  ];

  return (
    <RenderFields
      fields={fields}
      data={appointment}
      loading={isAppointmentLoading}
      className="p-4"
    />
  );
}
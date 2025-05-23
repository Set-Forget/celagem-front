import { useGetAppointmentQuery } from "@/lib/services/appointments";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useGetVisitQuery } from "@/lib/services/visits";
import { AppointmentDetail } from "@/app/(private)/medical-management/calendar/schemas/appointments";
import { modesOfCare } from "@/app/(private)/medical-management/calendar/utils";
import RenderFields from "@/components/render-fields";

export default function AppointmentTab() {
  const params = useParams<{ visit_id: string }>();

  const visitId = params.visit_id

  const { data: visit, isLoading: isVisitLoading } = useGetVisitQuery(visitId)
  const { data: appointment, isLoading: isAppointmentLoading } = useGetAppointmentQuery(visit?.appointment_id!, { skip: !visit?.appointment_id })

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
      label: "Firmado por",
      placeholderLength: 10,
      className: visit?.status === "DRAFT" ? "hidden" : "",
      render: (p) => "xxxx",
    },
    {
      label: "Fecha de firma",
      placeholderLength: 10,
      className: visit?.status === "DRAFT" ? "hidden" : "",
      render: (p) => visit?.signed_at ? format(new Date(visit?.signed_at), "PP", { locale: es }) : "No especificado",
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
      loading={isVisitLoading || isAppointmentLoading}
      data={appointment}
      className="p-4"
    />
  );
}
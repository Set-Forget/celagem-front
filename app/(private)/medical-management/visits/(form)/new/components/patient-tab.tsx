import { useGetAppointmentQuery } from "@/lib/services/appointments";
import { useGetPatientQuery } from "@/lib/services/patients";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useParams } from "next/navigation";
import { PatientDetail } from "../../../../patients/schema/patients";
import { biologicalSexTypes, disabilityTypes, documentTypes, linkageTypes } from "../../../../patients/utils";
import RenderFields from "@/components/render-fields";

export default function PatientTab() {
  const params = useParams<{ appointment_id: string }>();

  const appointmentId = params.appointment_id

  const { data: appointment } = useGetAppointmentQuery(appointmentId!, { skip: !appointmentId })

  const patientId = appointment?.patient.id;
  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(patientId!, {
    skip: !patientId,
  });

  const fields: FieldDefinition<PatientDetail>[] = [
    {
      label: "Nombre",
      placeholderLength: 14,
      render: (p) => p?.first_name + " " + p?.first_last_name
    },
    {
      label: "Tipo de vinculación",
      placeholderLength: 14,
      render: (p) =>
        linkageTypes.find((l) => l.value === p?.linkage)?.label || "No especificado",
    },
    {
      label: "Clase",
      placeholderLength: 14,
      render: (p) => p?.class?.name || "No especificado",
    },
    {
      label: "Sexo biológico",
      placeholderLength: 14,
      render: (p) =>
        biologicalSexTypes.find((b) => b.value === p?.biological_sex)?.label || "No especificado",
    },
    {
      label: "Fecha de nacimiento",
      placeholderLength: 13,
      render: (p) => p?.birth_date ? format(p?.birth_date, "PP", { locale: es }) : 'No especificado',
    },
    {
      label: "Dirección de residencia",
      placeholderLength: 14,
      render: (p) => p?.address?.formatted_address || "No especificado",
    },
    {
      label: "Discapacidad",
      placeholderLength: 14,
      render: (p) =>
        disabilityTypes.find((d) => d.value === p?.disability_type)?.label || "No especificado",
    },
    {
      label: "Número de documento",
      placeholderLength: 14,
      render: (p) => `${documentTypes.find((d) => d.value === p?.document_type)?.short || ""} ${p?.document_number}`,
    },
    {
      label: "Número de teléfono",
      placeholderLength: 10,
      render: (p) => p?.phone_number || "No especificado",
    },
    {
      label: "Email",
      placeholderLength: 14,
      render: (p) => p?.email || "No especificado",
    },
    {
      label: "Entidad/IPS remitente",
      placeholderLength: 14,
      render: (p) => p?.referring_entity || "No especificado",
    },
    {
      label: "Aseguradora",
      placeholderLength: 14,
      render: (p) => p?.insurance_provider || "No especificado",
    },
  ];

  return (
    <RenderFields
      fields={fields}
      loading={isPatientLoading}
      data={patient}
      className="p-4"
    />
  );
}

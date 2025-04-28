import { useGetAppointmentQuery } from "@/lib/services/appointments";
import { useGetPatientQuery } from "@/lib/services/patients";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useParams } from "next/navigation";
import { useGetVisitQuery } from "@/lib/services/visits";
import { PatientDetail } from "@/app/(private)/medical-management/patients/schema/patients";
import { biologicalSexTypes, disabilityTypes, documentTypes, genderIdentityTypes, linkageTypes, maritalStatusTypes } from "@/app/(private)/medical-management/patients/utils";

export default function PatientTab() {
  const params = useParams<{ visit_id: string }>();

  const visitId = params.visit_id

  const { data: visit } = useGetVisitQuery(visitId)
  const { data: appointment } = useGetAppointmentQuery(visit?.appointment_id!, { skip: !visit?.appointment_id })

  const patientId = appointment?.patient.id;
  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(patientId!, {
    skip: !patientId,
  });

  const fields: FieldDefinition<PatientDetail>[] = [
    {
      label: "Nombre",
      placeholderLength: 14,
      getValue: (p) => p.first_name + " " + p.first_last_name
    },
    {
      label: "Tipo de vinculación",
      placeholderLength: 14,
      getValue: (p) =>
        linkageTypes.find((l) => l.value === p.linkage)?.label || "No especificado",
    },
    {
      label: "Clase",
      placeholderLength: 14,
      getValue: (p) => p.class?.name || "No especificado",
    },
    {
      label: "Sexo biológico",
      placeholderLength: 14,
      getValue: (p) =>
        biologicalSexTypes.find((b) => b.value === p.biological_sex)?.label || "No especificado",
    },
    {
      label: "Fecha de nacimiento",
      placeholderLength: 13,
      getValue: (p) => p.birth_date ? format(p.birth_date, "PPP", { locale: es }) : 'No especificado',
    },
    {
      label: "Dirección de residencia",
      placeholderLength: 14,
      getValue: (p) => p.address?.formatted_address || "No especificado",
    },
    {
      label: "Discapacidad",
      placeholderLength: 14,
      getValue: (p) =>
        disabilityTypes.find((d) => d.value === p.disability_type)?.label || "No especificado",
    },
    {
      label: "Número de documento",
      placeholderLength: 14,
      getValue: (p) => `${documentTypes.find((d) => d.value === p.document_type)?.short || ""} ${p.document_number || "No especificado"}`,
    },
    {
      label: "Número de teléfono",
      placeholderLength: 10,
      getValue: (p) => p.phone_number || "No especificado",
    },
    {
      label: "Email",
      placeholderLength: 14,
      getValue: (p) => p.email || "No especificado",
    },
    {
      label: "Entidad/IPS remitente",
      placeholderLength: 14,
      getValue: (p) => p.referring_entity || "No especificado",
    },
    {
      label: "Aseguradora",
      placeholderLength: 14,
      getValue: (p) => p.insurance_provider || "No especificado",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {fields.map((field) => {
        const displayValue = isPatientLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(patient!) ?? "";
        return (
          <div className="flex flex-col gap-1" key={field.label}>
            <label className="text-muted-foreground text-sm">
              {field.label}
            </label>
            <span
              className={cn(
                "text-sm transition-all duration-300",
                isPatientLoading ? "blur-[4px]" : "blur-none"
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

import { useGetPatientQuery } from "@/lib/services/patients";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PatientDetail } from "../../../schema/patients";
import { linkageTypes } from "../../../utils";

export default function AffiliationTab() {
  const params = useParams<{ patient_id: string }>();
  const patientId = params.patient_id;

  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(patientId);

  const fields: FieldDefinition<PatientDetail>[] = [
    {
      label: "Clase",
      placeholderLength: 14,
      getValue: (p) => p.class?.name,
    },
    {
      label: "Compañia",
      placeholderLength: 14,
      getValue: (p) => p.company.name,
    },
    {
      label: "Aseguradora",
      placeholderLength: 14,
      getValue: (p) => p.insurance_provider || "No especificado",
    },
    {
      label: "Sedes",
      placeholderLength: 14,
      getValue: (p) => p.clinics.map((c) => c.name).join(", "),
    },
    {
      label: "Entidad/IPS remitente",
      placeholderLength: 14,
      getValue: (p) => p.referring_entity || "No especificado",
    },
    {
      label: "Tipo de vinculación",
      placeholderLength: 14,
      getValue: (p) =>
        linkageTypes.find((l) => l.value === p.linkage)?.label || "No especificado",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
  )
}
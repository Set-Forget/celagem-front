import { useGetPatientQuery } from "@/lib/services/patients";
import { cn, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PatientDetail } from "../../schema/patients";
import { FieldDefinition } from "./general-tab";

export default function CaregiverTab() {
  const params = useParams<{ patient_id: string }>();
  const patientId = params.patient_id;

  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(patientId);

  const fields: FieldDefinition<PatientDetail>[] = [
    {
      label: "Nombre",
      placeholderLength: 14,
      getValue: (p) => p.caregiver?.name,
    },
    {
      label: "Dirección",
      placeholderLength: 30,
      // @ts-expect-error - must be defined later
      getValue: (p) => p.caregiver?.address,
    },
    {
      label: "Tipo de documento",
      placeholderLength: 14,
      getValue: (p) => p.caregiver?.document_type,
    },
    {
      label: "Número de documento",
      placeholderLength: 14,
      getValue: (p) => p.caregiver?.document_number,
    },
    {
      label: "Número de teléfono",
      placeholderLength: 14,
      getValue: (p) => p.caregiver?.phone_number,
    },
    {
      label: "Parentesco",
      placeholderLength: 14,
      getValue: (p) => p.caregiver?.relationship,
    },
  ]

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
  );
}
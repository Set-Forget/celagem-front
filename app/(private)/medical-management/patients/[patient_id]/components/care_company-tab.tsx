import { useGetPatientQuery } from "@/lib/services/patients";
import { cn, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PatientDetail } from "../../schema/patients";
import { FieldDefinition } from "./general-tab";

export default function CareCompanyTab() {
  const params = useParams<{ patient_id: string }>();
  const patientId = params.patient_id;

  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(patientId);

  const fields: FieldDefinition<PatientDetail>[] = [
    {
      label: "Empresa",
      placeholderLength: 14,
      getValue: (p) => p.care_company?.name ?? "No especificado",
    },
    {
      label: "Contrato",
      placeholderLength: 14,
      getValue: (p) => p.care_company?.contract_number ?? "No especificado",
    },
    {
      label: "Plan de cobertura",
      placeholderLength: 14,
      getValue: (p) => p.care_company?.coverage ?? "No especificado",
    }
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
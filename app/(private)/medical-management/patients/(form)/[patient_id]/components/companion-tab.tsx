import { useGetPatientQuery } from "@/lib/services/patients";
import { cn, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PatientDetail } from "../../../schema/patients";
import { FieldDefinition } from "./general-tab";

export default function CompanionTab() {
  const params = useParams<{ patient_id: string }>();
  const patientId = params.patient_id;

  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(patientId);

  const fields: FieldDefinition<PatientDetail>[] = [
    {
      label: "Nombre",
      placeholderLength: 14,
      getValue: (p) => p.companion?.name,
    },
    {
      label: "Número de teléfono",
      placeholderLength: 14,
      getValue: (p) => p.companion?.phone_number,
    },
    {
      label: "Parentesco",
      placeholderLength: 14,
      getValue: (p) => p.companion?.relationship,
    },
    {
      label: "Dirección",
      placeholderLength: 30,
      getValue: (p) => p.companion?.address.formatted_address,
      className: "col-span-2",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => {
        const displayValue = isPatientLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(patient!) ?? "";
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
import { useGetPatientQuery } from "@/lib/services/patients";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PatientDetail } from "../../../schema/patients";
import { customerTypes, fiscalCategories } from "../../../utils";

export default function FiscalTab() {
  const params = useParams<{ patient_id: string }>();
  const patientId = params.patient_id;

  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(patientId);

  const fields: FieldDefinition<PatientDetail>[] = [
    {
      label: "Tipo de cliente",
      placeholderLength: 14,
      getValue: (p) =>
        customerTypes.find((type) => type.value === p.fiscal?.customer_type)?.label || "No aplica",
    },
    {
      label: "Razón social",
      placeholderLength: 14,
      getValue: (p) => p.fiscal?.registered_name || 'No aplica',
    },
    {
      label: "Número de identificación fiscal",
      placeholderLength: 14,
      getValue: (p) => p.fiscal?.tax_id,
    },
    {
      label: "Condición frente al IVA",
      placeholderLength: 14,
      getValue: (p) =>
        fiscalCategories.find((category) => category.value === p.fiscal?.fiscal_category)?.label || "No aplica",
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
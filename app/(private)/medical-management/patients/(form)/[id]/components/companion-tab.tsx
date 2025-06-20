import RenderFields from "@/components/render-fields";
import { useGetPatientQuery } from "@/lib/services/patients";
import { FieldDefinition } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PatientDetail } from "../../../schema/patients";

export default function CompanionTab() {
  const { id } = useParams<{ id: string }>();

  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(id);

  const fields: FieldDefinition<PatientDetail>[] = [
    {
      label: "Nombre",
      placeholderLength: 14,
      render: (p) => p.companion?.name,
    },
    {
      label: "Número de teléfono",
      placeholderLength: 14,
      render: (p) => p.companion?.phone_number || "No especificado",
    },
    {
      label: "Parentesco",
      placeholderLength: 14,
      render: (p) => p.companion?.relationship || "No especificado",
    },
    {
      label: "Dirección",
      placeholderLength: 30,
      render: (p) => p.companion?.address.formatted_address || "No especificado",
      className: "col-span-2",
    },
  ]

  return (
    <RenderFields
      fields={fields}
      loading={isPatientLoading}
      data={patient}
    />
  );
}
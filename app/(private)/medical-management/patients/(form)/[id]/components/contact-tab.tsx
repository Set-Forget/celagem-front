import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { useGetPatientQuery } from "@/lib/services/patients";
import { FieldDefinition } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PatientDetail } from "../../../schema/patients";

export default function ContactTab() {
  const { id } = useParams<{ id: string }>();

  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(id);

  const fields: FieldDefinition<PatientDetail>[] = [
    {
      label: "Número de teléfono",
      placeholderLength: 10,
      render: (p) => p.phone_number || "No especificado",
    },
    {
      label: "Correo electrónico",
      placeholderLength: 14,
      render: (p) => p.email ? <Button
        variant="link"
        className="p-0 h-auto text-foreground font-normal"
        asChild
      >
        <Link
          href={`mailto:${p.email}`}
          target="_blank"
        >
          {p.email}
        </Link>
      </Button> : "No especificado"
    },
    {
      label: "Dirección de residencia",
      placeholderLength: 14,
      render: (p) => p.address?.formatted_address,
    },
  ];

  return (
    <RenderFields
      fields={fields}
      loading={isPatientLoading}
      data={patient}
    />
  )
}
import { useGetPatientQuery } from "@/lib/services/patients";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PatientDetail } from "../../../schema/patients";
import RenderFields from "@/components/render-fields";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ContactTab() {
  const params = useParams<{ patient_id: string }>();
  const patientId = params.patient_id;

  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(patientId);

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
'use client'

import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { useGetDeliveryQuery } from "@/lib/services/deliveries";
import { FieldDefinition } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DeliveryNoteDetail } from "../../../schemas/delivery-notes";

const fields: FieldDefinition<DeliveryNoteDetail>[] = [
  {
    label: "Cliente",
    placeholderLength: 14,
    render: (p) => p.customer.name,
  },
  {
    label: "Teléfono",
    placeholderLength: 9,
    render: (p) => p.customer.phone,
  },
  {
    label: "Correo electrónico",
    placeholderLength: 9,
    render: (p) => <Button
      variant="link"
      className="p-0 h-auto text-foreground font-normal"
      asChild
    >
      <Link
        href={`mailto:${p.customer.email}`}
        target="_blank"
      >
        {p.customer.email}
      </Link>
    </Button>,
  },
  {
    label: "Dirección",
    placeholderLength: 20,
    render: (p) => p.customer.address,
  }
];

export default function CustomerTab() {
  const { id } = useParams<{ id: string }>()

  const { data: deliveryNote, isLoading: isDeliveryNoteLoading } = useGetDeliveryQuery(id);

  return (
    <RenderFields
      fields={fields}
      loading={isDeliveryNoteLoading}
      data={deliveryNote}
      className="p-4"
    />
  )
}
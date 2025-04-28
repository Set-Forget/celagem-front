'use client'

import { useGetDeliveryQuery } from "@/lib/services/deliveries";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { DeliveryNoteDetail } from "../../../schemas/delivery-notes";

const fields: FieldDefinition<DeliveryNoteDetail>[] = [
  {
    label: "Cliente",
    placeholderLength: 14,
    getValue: (p) => p.customer.name,
  },
  {
    label: "Teléfono",
    placeholderLength: 9,
    getValue: (p) => p.customer.phone,
  },
  {
    label: "Correo electrónico",
    placeholderLength: 9,
    getValue: (p) => p.customer.email,
  },
  {
    label: "Dirección",
    placeholderLength: 20,
    getValue: (p) => p.customer.address,
  }
];

export default function CustomerTab() {
  const { id } = useParams<{ id: string }>()

  const { data: deliveryNote, isLoading: isDeliveryNoteLoading } = useGetDeliveryQuery(id);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {fields.map((field) => {
        const displayValue = isDeliveryNoteLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(deliveryNote!) ?? "";
        return (
          <div className="flex flex-col gap-1" key={field.label}>
            <label className="text-muted-foreground text-sm">
              {field.label}
            </label>
            <span
              className={cn(
                "text-sm transition-all duration-300",
                isDeliveryNoteLoading ? "blur-[4px]" : "blur-none"
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
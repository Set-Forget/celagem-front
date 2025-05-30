import { MaterialSelectField } from "@/app/(private)/(commercial)/components/material-select-field";
import { QuantityField } from "@/app/(private)/(commercial)/components/quantity-field";
import { FormTableColumn } from "@/components/form-table";
import { Control } from "react-hook-form";
import { z } from "zod";
import { newPurchaseRequestSchema } from "../../../schemas/purchase-requests";

const MaterialsCell = ({ control, index }: { control: Control<z.infer<typeof newPurchaseRequestSchema>>; index: number }) => {
  return <MaterialSelectField
    control={control}
    name={`items.${index}.product_id`}
  />
}

export const columns: FormTableColumn<z.infer<typeof newPurchaseRequestSchema>>[] = [
  {
    header: "Producto / Servicio",
    width: 300,
    cellClassName: "pr-0",
    renderCell: (
      control,
      index,
    ) => <MaterialsCell control={control} index={index} />,
  },
  {
    header: "Cantidad",
    width: 100,
    align: "right",
    headerClassName: "px-0 pr-9",
    renderCell: (control, index) => <QuantityField
      control={control}
      name={`items.${index}.quantity`}
    />
  }
];

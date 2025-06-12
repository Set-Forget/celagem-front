import { MaterialSelectField } from "@/app/(private)/(commercial)/components/material-select-field";
import { QuantityField } from "@/app/(private)/(commercial)/components/quantity-field";
import { SubtotalField } from "@/app/(private)/(commercial)/components/subtotal-field";
import { TaxSelectField } from "@/app/(private)/(commercial)/components/tax-select-field";
import { UnitPriceField } from "@/app/(private)/(commercial)/components/unit-price-field";
import { FormTableColumn } from "@/components/form-table";
import { Control, useFormContext } from "react-hook-form";
import { z } from "zod";
import { newPurchaseOrderSchema } from "../../schemas/purchase-orders";

const MaterialsCell = ({ control, index }: { control: Control<z.infer<typeof newPurchaseOrderSchema>>; index: number }) => {
  const { setValue } = useFormContext<z.infer<typeof newPurchaseOrderSchema>>()
  return <MaterialSelectField
    control={control}
    name={`items.${index}.product_id`}
    onSelect={(value, option) => {
      console.log(option)
      if (option) {
        setValue(`items.${index}.price_unit`, option?.standard_price || 0, { shouldValidate: true });
      }
    }}
  />
}

export const columns: FormTableColumn<z.infer<typeof newPurchaseOrderSchema>>[] = [
  {
    header: "Producto / Servicio",
    width: 300,
    headerClassName: "text-nowrap",
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
      name={`items.${index}.product_qty`}
    />
  },
  {
    header: "Precio unitario",
    width: 150,
    align: "right",
    cellClassName: "border-l-0",
    renderCell: (control, index) => <UnitPriceField
      className="min-w-[200px]"
      control={control}
      name={`items.${index}.price_unit`}
      currencyPath="currency"
    />
  },
  {
    header: "Impuestos",
    width: 200,
    cellClassName: "pr-0 border-l-0",
    renderCell: (control, index) => <TaxSelectField
      control={control}
      name={`items.${index}.taxes_id`}
      type_tax_use="purchase"
    />,
  },
  {
    header: "Subtotal (Sin imp.)",
    width: 200,
    align: "left",
    cellClassName: "pl-4",
    headerClassName: "text-nowrap",
    renderCell: (control, index) => <SubtotalField
      control={control}
      currencyPath="currency"
      priceUnitPath={`items.${index}.price_unit`}
      quantityPath={`items.${index}.product_qty`}
    />
  },
];

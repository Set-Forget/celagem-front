import { AccountSelectField } from "@/app/(private)/(commercial)/components/account-select-field";
import { CostCenterSelectField } from "@/app/(private)/(commercial)/components/cost-center-select-field";
import { MaterialSelectField } from "@/app/(private)/(commercial)/components/material-select-field";
import { QuantityField } from "@/app/(private)/(commercial)/components/quantity-field";
import { SubtotalField } from "@/app/(private)/(commercial)/components/subtotal-field";
import { TaxSelectField } from "@/app/(private)/(commercial)/components/tax-select-field";
import { UnitPriceField } from "@/app/(private)/(commercial)/components/unit-price-field";
import { FormTableColumn } from "@/components/form-table";
import { Control, useFormContext } from "react-hook-form";
import { z } from "zod";
import { newInvoiceSchema } from "../../../schemas/invoices";

const MaterialsCell = ({ control, index }: { control: Control<z.infer<typeof newInvoiceSchema>>; index: number }) => {
  const { setValue } = useFormContext<z.infer<typeof newInvoiceSchema>>()
  return <MaterialSelectField
    control={control}
    name={`items.${index}.product_id`}
    onSelect={(value, option) => {
      if (option) {
        setValue(`items.${index}.price_unit`, option?.standard_price || 0, { shouldValidate: true });
      }
    }}
  />
}

export const columns: FormTableColumn<z.infer<typeof newInvoiceSchema>>[] = [
  {
    header: "Producto / Servicio",
    width: 300,
    headerClassName: "text-nowrap",
    cellClassName: "pr-0",
    renderCell: (control, index) => <MaterialsCell control={control} index={index} />,
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
  },
  {
    header: "Precio Unitario",
    width: 150,
    align: "right",
    headerClassName: "text-nowrap",
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
      type_tax_use="sale"
    />,
  },
  {
    header: "Centro de costo",
    width: 200,
    headerClassName: "text-nowrap",
    renderCell: (control, index) => <CostCenterSelectField
      control={control}
      name={`items.${index}.cost_center`}
    />
  },
  {
    header: "Cuenta contable",
    width: 200,
    renderCell: (control, index) => <AccountSelectField
      control={control}
      name={`items.${index}.account_id`}
    />
  },
  {
    header: "Subtotal (Sin imp.)",
    width: 200,
    align: "left",
    headerClassName: "text-nowrap",
    cellClassName: "pl-4",
    renderCell: (control, index) => <SubtotalField
      control={control}
      currencyPath="currency"
      priceUnitPath={`items.${index}.price_unit`}
      quantityPath={`items.${index}.quantity`}
    />
  },
];

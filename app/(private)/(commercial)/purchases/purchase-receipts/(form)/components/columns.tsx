import { MaterialSelectField } from "@/app/(private)/(commercial)/components/material-select-field";
import { QuantityField } from "@/app/(private)/(commercial)/components/quantity-field";
import { AsyncSelect } from "@/components/async-select";
import { FormTableColumn } from "@/components/form-table";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";
import { newPurchaseReceiptSchema } from "../../schemas/purchase-receipts";
import { useSearchParams } from "next/navigation";
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders";

const MaterialsCell = ({ control, index }: { control: Control<z.infer<typeof newPurchaseReceiptSchema>>; index: number }) => {
  return <MaterialSelectField
    control={control}
    name={`items.${index}.product_id`}
  />
}

const MeasurementCell = ({ control, index }: { control: Control<z.infer<typeof newPurchaseReceiptSchema>>; index: number }) => {
  const handleSearchMeasurementUnits = async (query?: string) => {
    return [{
      id: 1,
      name: "Units",
    }]
  }

  return <FormField
    control={control}
    name={`items.${index}.product_uom`}
    render={({ field }) => (
      <FormItem className="flex flex-col w-full">
        <FormControl>
          <AsyncSelect<{ id: number, name: string }, number>
            label="Unidad de medida"
            triggerClassName={cn(
              "!w-full rounded-none border-none shadow-none bg-transparent pl-4",
              control._formState.errors.items?.[index]?.product_uom && "outline outline-1 outline-offset-[-1px] outline-destructive"
            )}
            placeholder="Buscar unidad de medida..."
            fetcher={handleSearchMeasurementUnits}
            getDisplayValue={(item) => item.name}
            getOptionValue={(item) => item.id}
            renderOption={(item) => <>{item.name}</>}
            onChange={field.onChange}
            value={field.value}
            getOptionKey={(item) => String(item.id)}
            noResultsMessage="No se encontraron resultados"
            modal
          />
        </FormControl>
      </FormItem>
    )}
  />
}

const PendingQuantityCell = ({ control, index }: { control: Control<z.infer<typeof newPurchaseReceiptSchema>>; index: number }) => {
  const searchParams = useSearchParams()

  const purchaseOrderId = searchParams.get("purchase_order_id")

  const { data: purchaseOrder } = useGetPurchaseOrderQuery(purchaseOrderId!, { skip: !purchaseOrderId })

  const productId = useWatch({ control, name: `items.${index}.product_id` })

  const purchaseOrderLine = purchaseOrder?.items?.find(item => item.product_id === productId)
  const pendingQuantity = purchaseOrderLine?.product_qty ? purchaseOrderLine.product_qty - purchaseOrderLine.qty_received : 0

  return <div>{pendingQuantity}</div>
}

const ReceivedQuantityCell = ({ control, index }: { control: Control<z.infer<typeof newPurchaseReceiptSchema>>; index: number }) => {
  const searchParams = useSearchParams()

  const purchaseOrderId = searchParams.get("purchase_order_id")

  const { data: purchaseOrder } = useGetPurchaseOrderQuery(purchaseOrderId!, { skip: !purchaseOrderId })

  const productId = useWatch({ control, name: `items.${index}.product_id` })

  const purchaseOrderLine = purchaseOrder?.items?.find(item => item.product_id === productId)
  const pendingQuantity = purchaseOrderLine?.product_qty ? purchaseOrderLine.product_qty - purchaseOrderLine.qty_received : 0

  return <QuantityField
    control={control}
    name={`items.${index}.quantity`}
    max={pendingQuantity}
  />
}

export const columns: FormTableColumn<z.infer<typeof newPurchaseReceiptSchema>>[] = [
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
    header: "Unidad de medida",
    width: 100,
    align: "right",
    headerClassName: "px-0 pr-9",
    renderCell: (
      control,
      index,
    ) => <MeasurementCell control={control} index={index} />,
  },
  {
    header: "Cantidad recibida",
    width: 100,
    align: "right",
    headerClassName: "px-0 pr-9",
    renderCell: (control, index) => <ReceivedQuantityCell control={control} index={index} />,
  },
  {
    header: "Cantidad pendiente",
    width: 100,
    align: "right",
    headerClassName: "px-0 pr-9",
    cellClassName: "px-3 border-r border-l-0",
    renderCell: (control, index) => <PendingQuantityCell control={control} index={index} />,
  },
];

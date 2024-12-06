import { useFormContext, useWatch } from "react-hook-form"
import { z } from "zod"
import { newPurchaseOrderSchema } from "../../schemas/purchase-orders";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";

export default function CustomTableFooter() {
  const { control } = useFormContext<z.infer<typeof newPurchaseOrderSchema>>()

  const currency = useWatch({
    control: control,
    name: "currency"
  })

  const items = useWatch({
    control,
    name: `items`,
  });

  const subtotal = items.reduce((acc, item) => {
    return acc + (item.quantity * Number(item.price))
  }, 0)

  const taxes = items.reduce((acc, item) => {
    return acc + (item.quantity * Number(item.price) * (Number(item.tax) / 100))
  }, 0)

  const total = subtotal + taxes

  return (
    <TableFooter className="border-t-0">
      <TableRow className="!border-b bg-background">
        <TableCell colSpan={6} className="h-6 text-xs font-medium py-0">
          <span>Subtotal</span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-right pr-5">
          {currency}{" "}
          <span>
            {subtotal.toFixed(2)}
          </span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
      <TableRow className="!border-b bg-background">
        <TableCell colSpan={6} className="h-6 text-xs font-medium py-0">
          <span>Impuestos</span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-right pr-5">
          {currency}{" "}
          <span>
            {taxes.toFixed(2)}
          </span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} className="h-6 text-xs font-medium py-0">
          <span>Total</span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-right pr-5">
          {currency}{" "}
          <span>
            {total.toFixed(2)}
          </span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
    </TableFooter>
  )
}
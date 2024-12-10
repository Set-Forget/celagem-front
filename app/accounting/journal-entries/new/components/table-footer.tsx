import { useFormContext, useWatch } from "react-hook-form"
import { z } from "zod"
import { TableCell, TableFooter, TableRow } from "@/components/ui/table"
import { newPaymentSchema } from "../../schemas/payments"

export default function CustomTableFooter() {
  const { control } = useFormContext<z.infer<typeof newPaymentSchema>>()

  const items = useWatch({
    control,
    name: `invoices`,
  });

  const total = items.reduce((acc, item) => {
    return acc + Number(item.amount)
  }, 0)

  const totalBalance = items.reduce((acc, item) => {
    return acc + Number(item.balance)
  }, 0)

  return (
    <TableFooter className="border-t-0">
      <TableRow>
        <TableCell colSpan={3} className="h-6 text-xs font-medium py-0">
          <span>Total</span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-left pl-5">
          ARS{" "}
          <span>
            {totalBalance.toFixed(2)}
          </span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-left pl-5">
          ARS{" "}
          <span>
            {total.toFixed(2)}
          </span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
    </TableFooter>
  )
}
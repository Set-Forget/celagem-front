import { Button } from "@/components/ui/button"
import { TableFooter as ShadcnTableFooter, TableCell, TableRow } from "@/components/ui/table"
import { useListCurrenciesQuery } from "@/lib/services/currencies"
import { Plus } from "lucide-react"
import { useFormContext, useWatch } from "react-hook-form"
import { v4 as uuidv4 } from 'uuid'
import { z } from "zod"
import { newPaymentSchema } from "../../../schemas/payments"
import { columns, withholdings } from "./columns"

export default function TableFooter({ append }: { append: (value: any) => void }) {
  const { control } = useFormContext<z.infer<typeof newPaymentSchema>>()

  const { data: currencies } = useListCurrenciesQuery()

  const currency = useWatch({
    control: control,
    name: "currency"
  })

  const invoices = useWatch({
    control,
    name: `invoices`,
  }) || []

  const handleAddItem = () => {
    append({
      id: uuidv4(),
      amount: undefined
    });
  }

  const subtotal = invoices?.reduce((acc, item) => {
    return acc + Number(item.amount || 0);
  }, 0)

  const subtotalWithholdings = invoices?.reduce((acc, item) => {
    const totalInvoiceWithholding = item.withholding_ids?.reduce((innerAcc, withholdingId) => {
      const withholding = withholdings.find(w => w.id === withholdingId)
      return innerAcc + (withholding ? (item.amount * (withholding.amount / 100)) : 0);
    }, 0) || 0;

    return acc + totalInvoiceWithholding;
  }, 0)

  const total = subtotal - subtotalWithholdings;

  return (
    <ShadcnTableFooter className="border-t-0">
      <TableRow className="!border-b bg-background h-6" />
      <TableRow className="!border-b bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0 text-end">
          <span>Subtotal (Sin ret.)</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          {currencies?.data.find(c => c.id === Number(currency))?.name}{" "}
          <span>
            {subtotal.toFixed(2)}
          </span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
      <TableRow className="!border-b bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0 text-end">
          <span>Retenciones ({subtotal > 0 ? ((subtotalWithholdings / subtotal) * 100).toFixed(2) : 0}%)</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          {currencies?.data.find(c => c.id === Number(currency))?.name}{" "}
          <span>
            {subtotalWithholdings.toFixed(2)}
          </span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
      <TableRow className="!border-b">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-semibold py-0 text-end">
          <span>Total</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          <span className="font-semibold">
            {currencies?.data.find(c => c.id === Number(currency))?.name}{" "}
          </span>
          <span className="font-semibold">
            {total.toFixed(2)}
          </span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
      <TableRow className="bg-background border-b-0 border-t">
        <TableCell className="h-6 text-xs font-medium py-0 p-0" colSpan={columns.length + 1}>
          <Button
            onClick={handleAddItem}
            size="sm"
            variant="ghost"
            type="button"
            className="h-7 rounded-none w-full"
          >
            <Plus />
            Agregar item
          </Button>
        </TableCell>
      </TableRow>
    </ShadcnTableFooter>
  )
}

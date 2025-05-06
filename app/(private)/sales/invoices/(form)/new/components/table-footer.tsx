import { useFormContext, useWatch } from "react-hook-form"
import { z } from "zod"
import { TableCell, TableFooter as ShadcnTableFooter, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { v4 as uuidv4 } from 'uuid'
import { columns } from "./columns"
import { useListTaxesQuery } from "@/lib/services/taxes"
import { useListCurrenciesQuery } from "@/lib/services/currencies"
import { newInvoiceSchema } from "../../../schemas/invoices"

export default function TableFooter({ append }: { append: (value: any) => void }) {
  const { control } = useFormContext<z.infer<typeof newInvoiceSchema>>()

  const { data: taxes } = useListTaxesQuery()
  const { data: currencies } = useListCurrenciesQuery()

  const currency = useWatch({
    control: control,
    name: "currency"
  })

  const items = useWatch({
    control,
    name: `items`,
  }) || []

  const handleAddItem = () => {
    append({
      id: uuidv4(),
      quantity: 1,
      taxes_id: [],
    });
  }

  const unitPrices = items.map(item => Number(item.unit_price)) || []

  const subtotal = items.reduce((acc, item, index) => {
    const price = unitPrices[index] || 0
    return acc + (price * item.quantity)
  }, 0) || 0

  const subtotalTaxes = items.reduce((acc, item, index) => {
    const price = unitPrices[index] || 0
    const taxesAmount = item.taxes_id?.map(taxId => taxes?.data.find(tax => tax.id === taxId)?.amount || 0) || []
    return acc + (price * item.quantity * taxesAmount.reduce((acc, tax) => acc + tax, 0) / 100)
  }, 0) || 0

  const total = subtotal + subtotalTaxes

  return (
    <ShadcnTableFooter className="border-t-0">
      <TableRow className="!border-b bg-background h-6" />
      <TableRow className="!border-b bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0 text-end">
          <span>Subtotal (Sin imp.)</span>
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
          <span>Impuestos ({subtotal > 0 ? ((subtotalTaxes / subtotal) * 100).toFixed(2) : 0}%)</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          {currencies?.data.find(c => c.id === Number(currency))?.name}{" "}
          <span>
            {subtotalTaxes.toFixed(2)}
          </span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
      <TableRow>
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
        <TableCell className="h-6 text-xs font-medium py-0 p-0" colSpan={6}>
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
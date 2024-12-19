import { TableFooter as ShadcnTableFooter, TableCell, TableRow } from "@/components/ui/table"
import { useFormContext, useWatch } from "react-hook-form"
import { z } from "zod"
import { newInvoiceSchema } from "../../schemas/invoices"

export default function TableFooter({ append }: { append: (value: any) => void }) {
  const { control } = useFormContext<z.infer<typeof newInvoiceSchema>>()

  const currency = useWatch({
    control: control,
    name: "currency"
  })

  const items = useWatch({
    control,
    name: `items`,
  });

  const invoice_total = Number("24256.26")

  const subtotal = items.reduce((acc, item) => {
    return acc + (item.quantity * Number(item.price))
  }, 0)

  const taxes = items.reduce((acc, item) => {
    return acc + (item.quantity * Number(item.price) * (Number(item.tax) / 100))
  }, 0)

  const credit_note_total = subtotal + taxes

  // Ajustar el cálculo del total
  const total = Math.abs(invoice_total - credit_note_total) < 0.01 ? 0 : invoice_total - credit_note_total

  return (
    <ShadcnTableFooter className="border-t-0">
      <TableRow className="bg-background">
        <TableCell
          colSpan={6}
          className="h-6 text-xs font-medium py-0"
        >
          Subtotal
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5">
          {currency}{" "}{subtotal.toFixed(2)}
        </TableCell>
        <TableCell />
      </TableRow>
      <TableRow className="bg-background border-b-0 border-t">
        <TableCell colSpan={6} className="h-6 text-xs font-medium py-0">
          Impuestos
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5">
          {currency}{" "}{taxes.toFixed(2)}
        </TableCell>
        <TableCell />
      </TableRow>
      <TableRow className="border-t !border-b">
        <TableCell colSpan={6} className="h-6 text-xs font-medium py-0">
          Total nota de crédito
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5">
          -{currency}{" "}{credit_note_total.toFixed(2)}
        </TableCell>
        <TableCell />
      </TableRow>
      <TableRow className="!border-b">
        <TableCell colSpan={6} className="h-6 text-xs font-medium py-0">
          <span>Total factura</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5">
          <span>{currency}{" "}{invoice_total.toFixed(2)}</span>
        </TableCell>
        <TableCell />
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} className="h-6 text-xs font-medium py-0">
          <span>Saldo pendiente</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5">
          <span>{currency}{" "}{total.toFixed(2)}</span>
        </TableCell>
        <TableCell />
      </TableRow>
    </ShadcnTableFooter>
  )
}

import { TableFooter as ShadcnTableFooter, TableCell, TableRow } from "@/components/ui/table"
import { useListCurrenciesQuery } from "@/lib/services/currencies"
import { useGetInvoiceQuery } from "@/lib/services/invoices"
import { useListTaxesQuery } from "@/lib/services/taxes"
import { useSearchParams } from "next/navigation"
import { useFormContext, useWatch } from "react-hook-form"
import { z } from "zod"
import { newCreditNoteSchema } from "../../../schemas/credit-notes"
import { columns } from "./columns"

export default function TableFooter({ append }: { append: (value: any) => void }) {
  const params = useSearchParams()

  const { control } = useFormContext<z.infer<typeof newCreditNoteSchema>>()

  const invoiceId = params.get("invoiceId");
  const billId = params.get("billId");

  const { data: document } = useGetInvoiceQuery(invoiceId ?? billId ?? "", {
    skip: !invoiceId && !billId,
  });
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

  const unitPrices = items.map(item => Number(item.price_unit)) || []

  const subtotal = items.reduce((acc, item, index) => {
    const price = unitPrices[index] || 0
    return acc + (price * item.quantity)
  }, 0) || 0

  const subtotalTaxes = items.reduce((acc, item, index) => {
    const price = unitPrices[index] || 0
    const taxesAmount = item.taxes_id?.map(taxId => taxes?.data.find(tax => tax.id === taxId)?.amount || 0) || []
    return acc + (price * item.quantity * taxesAmount.reduce((acc, tax) => acc + tax, 0) / 100)
  }, 0) || 0

  const creditNoteAmount = subtotal + subtotalTaxes

  const invoiceAmount = document?.items.reduce((acc, item) => {
    return acc + (item.quantity * item.price_unit * (1 + (item.taxes.reduce((acc, tx) => {
      const tax = taxes?.data.find(t => t.id === tx.id)
      return acc + (tax ? tax.amount : 0)
    }, 0) / 100)))
  }, 0) || 0

  const netAmount = invoiceAmount - creditNoteAmount

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
            {subtotal?.toFixed(2)}
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
            {subtotalTaxes?.toFixed(2)}
          </span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
      <TableRow className="!border-b">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-semibold py-0 text-end">
          <span>Total nota de crédito</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          <span className="font-semibold">
            {currencies?.data.find(c => c.id === Number(currency))?.name}{" "}
          </span>
          <span className="font-semibold">
            {creditNoteAmount.toFixed(2)}
          </span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
      <TableRow className="!border-b bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0 text-end">
          <span>Total factura original</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          <span>
            {currencies?.data.find(c => c.id === Number(currency))?.name}{" "}
          </span>
          <span>
            {invoiceAmount?.toFixed(2)}
          </span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-semibold py-0 text-end">
          <span>Saldo pendiente</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-semibold py-0 text-left pr-5">
          <span>
            {currencies?.data.find(c => c.id === Number(currency))?.name}{" "}
          </span>
          <span>
            {netAmount?.toFixed(2)}
          </span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
    </ShadcnTableFooter>
  )
}
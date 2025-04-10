import { TableFooter as ShadcnTableFooter, TableCell, TableRow } from "@/components/ui/table";
import { useParams } from "next/navigation";
import { columns } from "./columns";
import { useGetDebitNoteQuery } from "@/lib/services/debit-notes";
import { useGetInvoiceQuery } from "@/lib/services/invoices";

export default function TableFooter() {
  const { id } = useParams<{ id: string }>()

  const { data: debitNote } = useGetDebitNoteQuery(id)
  const { data: invoice } = useGetInvoiceQuery(String(debitNote?.associated_invoice.id ?? ""), {
    skip: !debitNote?.associated_invoice.id
  })

  const unitPrices = debitNote?.items.map(item => item.price_unit) || []

  const subtotal = debitNote?.items.reduce((acc, item, index) => {
    const price = unitPrices[index] || 0
    return acc + (price * item.quantity)
  }, 0) || 0

  const subtotalTaxes = debitNote?.items.reduce((acc, item) => acc + item.price_tax, 0) ?? 0

  const debit_note_amount = subtotal + subtotalTaxes

  const invoice_amount = invoice?.items.reduce((total, item) => {
    const subtotal = item.price_subtotal;
    const totalTax = item.taxes?.reduce((acc, tax) => acc + (subtotal * tax.amount / 100), 0) || 0;
    return total + subtotal + totalTax;
  }, 0) || 0

  const net_amount = debit_note_amount + invoice_amount

  return (
    <ShadcnTableFooter>
      <TableRow className="!border-b bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0 text-end">
          <span>Subtotal (Sin imp.)</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          {debitNote?.currency.name}{" "}
          <span>
            {subtotal?.toFixed(2)}
          </span>
        </TableCell>
      </TableRow>
      <TableRow className="!border-b bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0 text-end">
          <span>Impuestos ({subtotal > 0 ? ((subtotalTaxes / subtotal) * 100).toFixed(2) : 0}%)</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          {debitNote?.currency.name}{" "}
          <span>
            {subtotalTaxes?.toFixed(2)}
          </span>
        </TableCell>
      </TableRow>
      <TableRow className="!border-b">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-semibold py-0 text-end">
          <span>Total nota de débito</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          <span className="font-semibold">
            {debitNote?.currency.name}{" "}
          </span>
          <span className="font-semibold">
            {debit_note_amount.toFixed(2)}
          </span>
        </TableCell>
      </TableRow>
      <TableRow className="!border-b bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0 text-end">
          <span>Total factura original</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          <span>
            {debitNote?.currency.name}{" "}
          </span>
          <span>
            {invoice_amount?.toFixed(2)}
          </span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-semibold py-0 text-end">
          <span>Saldo pendiente</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-semibold py-0 text-left pr-5">
          <span>
            {debitNote?.currency.name}{" "}
          </span>
          <span>
            {net_amount?.toFixed(2)}
          </span>
        </TableCell>
      </TableRow>
    </ShadcnTableFooter>
  )
}
import { TableFooter as ShadcnTableFooter, TableCell, TableRow } from "@/components/ui/table";
import { useGetDebitNoteQuery } from "@/lib/services/debit-notes";
import { useParams } from "next/navigation";
import { columns } from "./columns";

export default function TableFooter() {
  const { id } = useParams<{ id: string }>()

  const { data: debitNote } = useGetDebitNoteQuery(id)

  const unitPrices = debitNote?.items.map(item => item.price_unit) || []

  const subtotal = debitNote?.items.reduce((acc, item, index) => {
    const price = unitPrices[index] || 0
    return acc + (price * item.quantity)
  }, 0) || 0

  const subtotalTaxes = debitNote?.items.reduce((acc, item) => acc + item.price_tax, 0) ?? 0

  const total = subtotal + subtotalTaxes

  const currency = debitNote?.currency.name

  return (
    <ShadcnTableFooter>
      <TableRow className="!border-b bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0 text-end">
          <span>Subtotal (Sin imp.)</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          {currency}{" "}
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
          {currency}{" "}
          <span>
            {subtotalTaxes?.toFixed(2)}
          </span>
        </TableCell>
      </TableRow>
      <TableRow className="bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs py-0 text-end font-semibold">
          <span>Total</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-semibold py-0">
          <span>{currency} {total.toFixed(2)}</span>
        </TableCell>
      </TableRow>
      <TableRow className="bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-semibold py-0 text-end !border-b-0 bg-muted/50">
          <span>Saldo pendiente</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-semibold py-0 bg-muted/50">
          <span>{currency} {debitNote?.amount_residual.toFixed(2)}</span>
        </TableCell>
      </TableRow>
    </ShadcnTableFooter>
  )
}
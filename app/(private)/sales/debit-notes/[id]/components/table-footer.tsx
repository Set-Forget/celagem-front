import { TableFooter as ShadcnTableFooter, TableCell, TableRow } from "@/components/ui/table";
import { useParams } from "next/navigation";
import { columns } from "./columns";
import { useGetDebitNoteQuery } from "@/lib/services/debit-notes";

export default function TableFooter() {
  const { id } = useParams<{ id: string }>()

  const { data: debitNote } = useGetDebitNoteQuery(id)

  const subtotal = debitNote?.items.reduce((acc, item) => acc + item.price_subtotal, 0) ?? 0
  //const taxes = debitNote?.items.reduce((acc, item) => acc + item.price_tax, 0) ?? 0
  const total = subtotal// + taxes

  return (
    <ShadcnTableFooter>
      <TableRow className="!border-solid !border-b bg-background h-6" />
      <TableRow className="bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs py-0 text-end">
          <span>Subtotal (sin imp.)</span>
        </TableCell>
        <TableCell className="h-6 text-xs py-0">
          <span>{debitNote?.currency} {subtotal.toFixed(2)}</span>
        </TableCell>
      </TableRow>
      <TableRow className="bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs py-0 text-end">
          <span>Impuestos</span>
        </TableCell>
        <TableCell className="h-6 text-xs py-0">
          <span>{debitNote?.currency} xxxxx {/* {taxes.toFixed(2)} */}</span>
        </TableCell>
      </TableRow>
      <TableRow className="bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-semibold py-0 text-end bg-muted/50">
          <span>Total nota de crédito</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-semibold py-0 bg-muted/50">
          <span>{debitNote?.currency} -{total.toFixed(2)}</span>
        </TableCell>
      </TableRow>
      <TableRow className="bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs py-0 text-end">
          <span>Total factura</span>
        </TableCell>
        <TableCell className="h-6 text-xs py-0">
          <span>{debitNote?.currency} xxxxx</span>
        </TableCell>
      </TableRow>
      <TableRow className="bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-semibold py-0 text-end bg-muted/50">
          <span>Saldo pendiente</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-semibold py-0 bg-muted/50">
          <span>{debitNote?.currency} xxxxx</span>
        </TableCell>
      </TableRow>
    </ShadcnTableFooter>
  )
}
import { TableFooter as ShadcnTableFooter, TableCell, TableRow } from "@/components/ui/table";
import { useGetBillQuery } from "@/lib/services/bills";
import { useParams } from "next/navigation";
import { columns } from "./columns";
import { useGetInvoiceQuery } from "@/lib/services/invoices";

export default function TableFooter() {
  const { id } = useParams<{ id: string }>()

  const { data: invoice } = useGetInvoiceQuery(id);

  const subtotal = invoice?.items.reduce((acc, item) => acc + item.price_subtotal, 0) ?? 0
  //const taxes = invoice?.items.reduce((acc, item) => acc + item.price_tax, 0) ?? 0
  const total = subtotal //+ taxes

  return (
    <ShadcnTableFooter>
      <TableRow className="!border-solid !border-b bg-background h-6" />
      <TableRow className="bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs py-0 text-end">
          <span>Subtotal (sin imp.)</span>
        </TableCell>
        <TableCell className="h-6 text-xs py-0">
          <span>{invoice?.currency} {subtotal.toFixed(2)}</span>
        </TableCell>
      </TableRow>
      <TableRow className="bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs py-0 text-end">
          <span>Impuestos</span>
        </TableCell>
        <TableCell className="h-6 text-xs py-0">
          <span>
            xxxxx
            {/* invoice?.currency} {taxes.toFixed(2)} */}
          </span>
        </TableCell>
      </TableRow>
      <TableRow className="bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-semibold py-0 text-end !border-b-0 bg-muted/50">
          <span>Total</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-semibold py-0 bg-muted/50">
          <span>{invoice?.currency} {total.toFixed(2)}</span>
        </TableCell>
      </TableRow>
    </ShadcnTableFooter>
  )
}
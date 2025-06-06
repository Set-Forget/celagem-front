import { TableCell, TableFooter as ShadcnTableFooter, TableRow } from "@/components/ui/table";
import { columns } from "./columns";
import { useParams } from "next/navigation";
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders";

export default function TableFooter() {
  const { id } = useParams<{ id: string }>()

  const { data: purchaseOrder } = useGetPurchaseOrderQuery(id);

  const subtotal = purchaseOrder?.items.reduce((acc, item) => acc + item.price_subtotal, 0) ?? 0
  const taxes = purchaseOrder?.items.reduce((acc, item) => acc + item.price_tax, 0) ?? 0
  const total = subtotal + taxes

  const currencyName = purchaseOrder?.currency.name

  return (
    <ShadcnTableFooter>
      <TableRow className="bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs py-0 text-end">
          <span>Subtotal (sin imp.)</span>
        </TableCell>
        <TableCell className="h-6 text-xs py-0">
          <span>{currencyName} {subtotal.toFixed(2)}</span>
        </TableCell>
      </TableRow>
      <TableRow className="bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs py-0 text-end">
          <span>Impuestos</span>
        </TableCell>
        <TableCell className="h-6 text-xs py-0">
          <span>{currencyName} {taxes.toFixed(2)}</span>
        </TableCell>
      </TableRow>
      <TableRow className="bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-semibold py-0 text-end !border-b-0 bg-muted/50">
          <span>Total</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-semibold py-0 bg-muted/50">
          <span>{currencyName} {total.toFixed(2)}</span>
        </TableCell>
      </TableRow>
    </ShadcnTableFooter>
  )
}
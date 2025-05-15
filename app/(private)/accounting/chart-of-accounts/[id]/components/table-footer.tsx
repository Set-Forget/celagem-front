import { TableFooter as ShadcnTableFooter, TableCell, TableRow } from "@/components/ui/table";
import { useGetInvoiceQuery } from "@/lib/services/invoices";
import { useParams } from "next/navigation";
import { columns } from "./columns";
import { useListAccountingAccountMoveLinesQuery } from "@/lib/services/accounting-accounts";

export default function TableFooter() {
  const { id } = useParams<{ id: string }>()

  const { data: accountMoves } = useListAccountingAccountMoveLinesQuery(id)

  const totalDebit = accountMoves?.data.reduce((acc, move) => acc + (move.debit || 0), 0) || 0
  const totalCredit = accountMoves?.data.reduce((acc, move) => acc + (move.credit || 0), 0) || 0
  const totalBalance = accountMoves?.data.reduce((acc, move) => acc + (move.balance || 0), 0) || 0

  return (
    <ShadcnTableFooter>
      <TableRow className="!border-solid !border-b bg-background h-6" />
      <TableRow className="bg-secondary">
        <TableCell className="h-6 text-xs py-0 text-start font-semibold">
          Totales
        </TableCell>
        <TableCell colSpan={columns.length - 4} className="h-6" />
        <TableCell className="h-6 text-xs py-0 text-start font-semibold">
          {totalDebit.toFixed(2)}
        </TableCell>
        <TableCell className="h-6 text-xs py-0 text-start font-semibold">
          {totalCredit.toFixed(2)}
        </TableCell>
        <TableCell className="h-6 text-xs py-0 text-start font-semibold">
          {totalBalance.toFixed(2)}
        </TableCell>
      </TableRow>
    </ShadcnTableFooter >
  )
}
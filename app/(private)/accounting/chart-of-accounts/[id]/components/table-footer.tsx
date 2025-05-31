import { TableFooter as ShadcnTableFooter, TableCell, TableRow } from "@/components/ui/table";
import { useListAccountingAccountMoveLinesQuery } from "@/lib/services/accounting-accounts";
import { useParams } from "next/navigation";
import { columns } from "./columns";

export default function TableFooter() {
  const { id } = useParams<{ id: string }>()

  const { data: accountMoves } = useListAccountingAccountMoveLinesQuery(id)

  const totalDebit = accountMoves?.data.reduce((acc, move) => acc + (move.debit || 0), 0) || 0
  const totalCredit = accountMoves?.data.reduce((acc, move) => acc + (move.credit || 0), 0) || 0
  const totalBalance = accountMoves?.data.reduce((acc, move) => acc + (move.balance || 0), 0) || 0

  return (
    <ShadcnTableFooter
      className="sticky bottom-0 z-10 before:absolute before:top-0 before:left-0 before:w-full before:h-px before:bg-border border-t-0">
      <TableRow className="bg-sidebar hover:bg-secondary">
        <TableCell className="h-6 text-xs py-0 text-start font-semibold">
          Total
        </TableCell>
        <TableCell colSpan={columns.length - 4} className="h-6" />
        <TableCell className="h-6 text-xs py-0 text-start font-semibold">
          USD {totalDebit.toFixed(2)}
        </TableCell>
        <TableCell className="h-6 text-xs py-0 text-start font-semibold">
          USD {totalCredit.toFixed(2)}
        </TableCell>
        <TableCell className="h-6 text-xs py-0 text-start font-semibold">
          USD {totalBalance.toFixed(2)}
        </TableCell>
      </TableRow>
    </ShadcnTableFooter >
  )
}
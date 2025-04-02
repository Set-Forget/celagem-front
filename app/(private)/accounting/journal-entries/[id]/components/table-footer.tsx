import { TableFooter as ShadcnTableFooter, TableCell, TableRow } from "@/components/ui/table";
import { useGetJournalEntryQuery } from "@/lib/services/journal-entries";
import { useParams } from "next/navigation";

export default function TableFooter() {
  const { id } = useParams<{ id: string }>()

  const { data: journalEntry } = useGetJournalEntryQuery(id)

  const totalCredit = journalEntry?.items.reduce((acc, item) => acc + item.credit, 0) ?? 0
  const totalDebit = journalEntry?.items.reduce((acc, item) => acc + item.debit, 0) ?? 0
  const totalTax = journalEntry?.items.reduce((acc, item) => acc + item.tax_amount, 0) ?? 0

  return (
    <ShadcnTableFooter>
      <TableRow className="bg-background">
        <TableCell className="h-6 text-xs font-semibold py-0 !border-b-0 bg-muted/50">
          <span>Total</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-semibold py-0 !border-b-0 bg-muted/50">
          {journalEntry?.currency}{" "}{totalDebit}
        </TableCell>
        <TableCell className="h-6 text-xs font-semibold py-0 !border-b-0 bg-muted/50">
          {journalEntry?.currency}{" "}{totalCredit}
        </TableCell>
        <TableCell className="h-6 text-xs font-semibold py-0 !border-b-0 bg-muted/50">
          {journalEntry?.currency}{" "}{totalTax}
        </TableCell>
      </TableRow>
    </ShadcnTableFooter>
  )
}
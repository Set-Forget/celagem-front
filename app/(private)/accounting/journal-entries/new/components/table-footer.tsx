import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { z } from "zod"
import { TableCell, TableFooter, TableRow } from "@/components/ui/table"
import { newJournalEntrySchema } from "../../schemas/journal-entries";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CustomTableFooter({ append }: { append: (value: any) => void }) {
  const { control } = useFormContext<z.infer<typeof newJournalEntrySchema>>()

  const items = useWatch({
    control,
    name: `items`,
  });

  const totalDebit = items.reduce((acc, item) => {
    return acc + Number(item.debit)
  }, 0)

  const totalCredit = items.reduce((acc, item) => {
    return acc + Number(item.credit)
  }, 0)

  const handleAddItem = () => {
    append({
      account: "",
      credit: 0,
      debit: 0,
    })
  }

  return (
    <TableFooter className="border-t-0">
      <TableRow>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0">
          <span>Total</span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-left pl-4">
          ARS{" "}
          <span>
            {totalDebit.toFixed(2)}
          </span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-left pl-4">
          ARS{" "}
          <span>
            {totalCredit.toFixed(2)}
          </span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
      <TableRow className="bg-background border-b-0 border-t">
        <TableCell className="h-6 text-xs font-medium py-0" colSpan={4}>
          <Button
            onClick={handleAddItem}
            size="sm"
            type="button"
            variant="ghost"
            className="h-7 rounded-none w-full"
          >
            <Plus />
            Agregar item
          </Button>
        </TableCell>
      </TableRow>
    </TableFooter>
  )
}
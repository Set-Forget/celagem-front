import { Button } from "@/components/ui/button"
import { TableFooter as ShadcnTableFooter, TableCell, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import { v4 as uuidv4 } from 'uuid'

export default function TableFooter({ append }: { append: (value: any) => void }) {

  const handleAddItem = () => {
    append({
      id: uuidv4(),
      quantity: 1,
      taxes_id: [],
    });
  }

  return (
    <ShadcnTableFooter className="border-t-0">
      <TableRow className="bg-background border-b-0 border-t">
        <TableCell className="h-6 text-xs font-medium py-0 p-0" colSpan={6}>
          <Button
            onClick={handleAddItem}
            size="sm"
            variant="ghost"
            type="button"
            className="h-7 rounded-none w-full"
          >
            <Plus />
            Agregar item
          </Button>
        </TableCell>
      </TableRow>
    </ShadcnTableFooter>
  )
}
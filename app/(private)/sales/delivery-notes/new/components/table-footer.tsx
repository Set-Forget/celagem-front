import { Button } from "@/components/ui/button";
import { TableFooter as ShadcnTableFooter, TableCell, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

export default function TableFooter({ append }: { append: (value: any) => void }) {

  const handleAddItem = () => {
    append({
      id: uuidv4(),
      description: "",
      received_quantity: 0,
      item_name: "",
      item_code: "",
    });
  }

  return (
    <ShadcnTableFooter className="border-t-0">
      <TableRow className="bg-background">
        <TableCell className="h-6 text-xs font-medium py-0" colSpan={8}>
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
    </ShadcnTableFooter>
  )
}
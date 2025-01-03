import { Button } from "@/components/ui/button"
import { TableCell, TableFooter, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import { v4 as uuidv4 } from 'uuid'

// OBTENER EL TIPO DE DATO ESPECIFICO EN VEZ DE USAR ANY (QUIZAS USANDO GENERICS)
export default function ItemsTableFooter({ append }: { append: (value: any) => void }) {
  const handleAddItem = () => {
    append({
      id: uuidv4(),
      description: "",
      quantity: 1,
      item_code: "",
      item_name: ""
    });
  }

  return (
    <TableFooter className="border-t-0">
      <TableRow className="bg-background border-b-0">
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
    </TableFooter>
  )
}
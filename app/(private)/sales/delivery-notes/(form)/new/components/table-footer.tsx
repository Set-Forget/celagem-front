import { Button } from "@/components/ui/button";
import { TableFooter as ShadcnTableFooter, TableCell, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

export default function TableFooter({ append }: { append: (value: any) => void }) {

  const handleAddItem = () => {
    append({
      product_id: undefined,
      name: "",
      product_uom: 1,
      quantity: 1,
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
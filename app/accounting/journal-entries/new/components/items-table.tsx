import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useFieldArray, useFormContext } from "react-hook-form"
import { z } from "zod"

import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { newJournalEntrySchema } from "../../schemas/journal-entries"
import ItemRow from "./item-row"

export default function ItemsTable() {
  const { control } = useFormContext<z.infer<typeof newJournalEntrySchema>>()

  const { fields, append: appendItem, remove: removeItem } = useFieldArray({
    control: control,
    name: "items",
  });

  const handleAddItem = () => {
    appendItem({
      account: "",
      credit: 0,
      debit: 0,
    })
  }

  return (
    <div className="flex flex-col gap-2 flex-grow">
      <div className="flex items-center justify-between w-full">
        <Label>
          Asientos contables
        </Label>
      </div>
      <div className="flex flex-col border rounded-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-9">Cuenta</TableHead>
              <TableHead className="h-9">Debe</TableHead>
              <TableHead className="h-9 pl-3">Haber</TableHead>
              <TableHead className="w-9 h-9"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody scrollBarClassName="pt-[40px]">
            {fields.map((item, index) => (
              <ItemRow key={item.id} index={index} remove={removeItem} />
            ))}
            <TableRow className="m-0 text-center text-muted-foreground text-xs">
              <TableCell colSpan={8} className="h-6 p-0">
                <Button
                  onClick={handleAddItem}
                  size="sm"
                  type="button"
                  variant="ghost"
                  className="h-9 rounded-none w-full"
                >
                  <Plus />
                  Agregar Asiento
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
          {/*           <CustomTableFooter />
 */}        </Table>
      </div>
    </div>
  )
}
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useFieldArray, useFormContext } from "react-hook-form"
import { v4 as uuidv4 } from 'uuid'
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
import { newBillSchema } from "../../schemas/bills"
import ItemRow from "./item-row"
import TableFooter from "./table-footer"

export default function ItemsTable() {
  const { control } = useFormContext<z.infer<typeof newBillSchema>>()

  const { fields, append: appendItem, remove: removeItem } = useFieldArray({
    control: control,
    name: "items",
  });

  const handleAddItem = () => {
    appendItem({
      id: uuidv4(),
      description: "",
      quantity: 1,
      price: "",
      tax: "21",
      item_code: "",
      item_name: "",
    });
  }

  return (
    <div className="flex flex-col gap-2 flex-grow">
      <div className="flex items-center justify-between w-full">
        <Label>
          Items
        </Label>
      </div>
      <div className="flex flex-col border rounded-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-9">Código</TableHead>
              <TableHead className="h-9">Nombre</TableHead>
              <TableHead className="h-9 pl-3">Descripción</TableHead>
              <TableHead className="h-9">Cantidad</TableHead>
              <TableHead className="h-9">Precio unitario</TableHead>
              <TableHead className="h-9">Impuesto</TableHead>
              <TableHead className="text-right h-9 pr-5">Subtotal</TableHead>
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
                  Agregar Item
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter />
        </Table>
      </div>
    </div>
  )
}
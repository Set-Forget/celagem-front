

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
import { newBillSchema } from "../../schemas/bills"
import ItemRow from "./item-row"
import TableFooter from "./table-footer"

export default function ItemsTable() {
  const { control } = useFormContext<z.infer<typeof newBillSchema>>()

  const { fields, append: appendItem, remove: removeItem } = useFieldArray({
    control: control,
    name: "items",
  });

  return (
    <div className="flex flex-col gap-2 flex-grow">
      <div className="flex items-center justify-between w-full">
        <Label>
          Items
        </Label>
      </div>
      <div className="flex flex-col">
        <Table className="border-none">
          <TableHeader className="bg-sidebar">
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
          <TableBody>
            {fields.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  <span className="text-xs text-muted-foreground">No hay items</span>
                </TableCell>
              </TableRow>
            )}
            {fields.map((item, index) => (
              <ItemRow key={item.id} index={index} remove={removeItem} />
            ))}
          </TableBody>
          <TableFooter append={appendItem} />
        </Table>
      </div>
    </div>
  )
}
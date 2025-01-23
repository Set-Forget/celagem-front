import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useFieldArray, useFormContext } from "react-hook-form"
import { v4 as uuidv4 } from 'uuid'
import { z } from "zod"

import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import ItemRow from "./item-row"
import { newPurchaseReceiptSchema } from "../../schemas/purchase-receipts"
import { cn } from "@/lib/utils"
import TableFooter from "./table-footer"

export default function ItemsTable({ className }: { className?: string }) {
  const { control } = useFormContext<z.infer<typeof newPurchaseReceiptSchema>>()

  const { fields, append: appendItem, remove: removeItem } = useFieldArray({
    control: control,
    name: "items",
  });

  return (
    <div className={cn("flex flex-col gap-2 flex-grow", className)}>
      <div className="flex items-center justify-between w-full">
        <Label>
          Productos
        </Label>
      </div>
      <div className="flex flex-col">
        <Table className="border-none">
          <TableHeader className="bg-sidebar">
            <TableRow>
              <TableHead className="h-9 pl-3">Descripción</TableHead>
              <TableHead className="w-[100px] h-9">Nombre</TableHead>
              <TableHead className="w-[100px] h-9">Código</TableHead>
              <TableHead className="h-9">Cantidad recibida</TableHead>
              <TableHead className="w-9 h-9"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody scrollBarClassName="pt-[40px]">
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
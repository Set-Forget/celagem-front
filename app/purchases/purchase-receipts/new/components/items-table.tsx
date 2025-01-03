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
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import ItemRow from "./item-row"
import { newPurchaseReceiptSchema } from "../../schemas/purchase-receipts"

export default function ItemsTable() {
  const { control } = useFormContext<z.infer<typeof newPurchaseReceiptSchema>>()

  const { fields, append: appendItem, remove: removeItem } = useFieldArray({
    control: control,
    name: "items",
  });

  const handleAddItem = () => {
    appendItem({
      id: uuidv4(),
      description: "",
      received_quantity: 0,
      item_name: "",
      item_code: "",
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
              <TableHead className="h-9 pl-3">Descripción</TableHead>
              <TableHead className="w-[100px] h-9">Nombre</TableHead>
              <TableHead className="w-[100px] h-9">Código</TableHead>
              <TableHead className="h-9">Cantidad recibida</TableHead>
              <TableHead className="w-9 h-9"></TableHead>
            </TableRow>
          </TableHeader>
          <TableCaption className="m-0 text-center text-muted-foreground text-xs">
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
          </TableCaption>
          <TableBody scrollBarClassName="pt-[40px]">
            {fields.map((item, index) => (
              <ItemRow key={item.id} index={index} remove={removeItem} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
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
import { newReceiptSchema } from "../../schemas/receipts"
import ItemRow from "./item-row"
import CustomTableFooter from "./table-footer"

export default function ItemsTable() {
  const { control } = useFormContext<z.infer<typeof newReceiptSchema>>()

  const { fields, append: appendItem, remove: removeItem } = useFieldArray({
    control: control,
    name: "invoices",
  });

  const handleAddItem = () => {
    appendItem({
      id: "",
      status: "pending",
      provider: "",
      invoice_number: "",
      invoice_date: "",
      due_date: "",
      amount: "",
      balance: 0,
      currency: "",
    })
  }

  return (
    <div className="flex flex-col gap-2 flex-grow">
      <div className="flex items-center justify-between w-full">
        <Label>
          Facturas
        </Label>
      </div>
      <div className="flex flex-col border rounded-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-9">Número</TableHead>
              <TableHead className="h-9">Cliente</TableHead>
              <TableHead className="h-9 pl-3">Estado</TableHead>
              <TableHead className="h-9">Saldo</TableHead>
              <TableHead className="h-9">Importe a saldar</TableHead>
              <TableHead className="w-9 h-9"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
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
                  Agregar Factura
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
          <CustomTableFooter />
        </Table>
      </div>
    </div>
  )
}
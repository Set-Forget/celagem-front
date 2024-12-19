import { useFormContext, useWatch } from "react-hook-form"
import { newBillSchema } from "../../schemas/bills"
import { z } from "zod"
import { TableCell, TableFooter, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { v4 as uuidv4 } from 'uuid'

export default function CustomTableFooter({ append }: { append: (value: any) => void }) {
  const { control } = useFormContext<z.infer<typeof newBillSchema>>()

  const currency = useWatch({
    control: control,
    name: "currency"
  })

  const items = useWatch({
    control,
    name: `items`,
  });

  const handleAddItem = () => {
    append({
      id: uuidv4(),
      description: "",
      quantity: 1,
      price: "",
      tax: "21",
    });
  }

  const subtotal = items.reduce((acc, item) => {
    return acc + (item.quantity * Number(item.price))
  }, 0)

  const taxes = items.reduce((acc, item) => {
    return acc + (item.quantity * Number(item.price) * (Number(item.tax) / 100))
  }, 0)

  const total = subtotal + taxes

  return (
    <TableFooter className="border-t-0">
      <TableRow className="!border-b bg-background">
        <TableCell colSpan={6} className="h-6 text-xs font-medium py-0">
          <span>Subtotal</span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-right pr-5">
          {currency}{" "}
          <span>
            {subtotal.toFixed(2)}
          </span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
      <TableRow className="!border-b bg-background">
        <TableCell colSpan={6} className="h-6 text-xs font-medium py-0">
          <span>Impuestos</span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-right pr-5">
          {currency}{" "}
          <span>
            {taxes.toFixed(2)}
          </span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} className="h-6 text-xs font-medium py-0">
          <span>Total</span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-right pr-5">
          {currency}{" "}
          <span>
            {total.toFixed(2)}
          </span>
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
      <TableRow className="bg-background border-b-0 border-t">
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
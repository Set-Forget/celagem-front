import { useFormContext, useWatch } from "react-hook-form"
import { newInvoiceSchema } from "../../schemas/invoices"
import { TableFooter as ShadcnTableFooter, TableCell, TableRow } from "@/components/ui/table"
import { z } from "zod"
import { v4 as uuidv4 } from 'uuid'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function TableFooter({ append }: { append: (value: any) => void }) {
  const { control } = useFormContext<z.infer<typeof newInvoiceSchema>>()

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
    <ShadcnTableFooter className="border-t-0">
      <TableRow className="bg-background">
        <TableCell
          colSpan={6}
          className="h-6 text-xs font-medium py-0"
        >
          Subtotal
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-right pr-5">
          {currency}{" "}{subtotal.toFixed(2)}
        </TableCell>
        <TableCell />
      </TableRow>
      <TableRow className="bg-background border-b-0 border-t">
        <TableCell colSpan={6} className="h-6 text-xs font-medium py-0">
          Impuestos
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-right pr-5">
          {currency}{" "}{taxes.toFixed(2)}
        </TableCell>
        <TableCell />
      </TableRow>
      <TableRow className="border-b-0 border-t">
        <TableCell colSpan={6} className="h-6 text-xs font-medium py-0">
          Total
        </TableCell>
        <TableCell colSpan={1} className="h-6 text-xs font-medium py-0 text-right pr-5">
          {currency}{" "}{total.toFixed(2)}
        </TableCell>
        <TableCell />
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
    </ShadcnTableFooter>
  )
}
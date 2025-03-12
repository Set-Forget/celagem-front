import { useFormContext, useWatch } from "react-hook-form"
import { z } from "zod"
import { TableCell, TableFooter as ShadcnTableFooter, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { v4 as uuidv4 } from 'uuid'
import { newInvoiceSchema } from "../../schemas/invoices"
import { columns } from "./columns"

// ! Debe traerse de la API
const materials = [
  {
    id: 1,
    name: "Material 1",
    code: "MAT-001",
    price: 100,
  },
  {
    id: 2,
    name: "Material 2",
    code: "MAT-002",
    price: 200,
  },
  {
    id: 3,
    name: "Material 3",
    code: "MAT-003",
    price: 300,
  },
  {
    id: 4,
    name: "Material 4",
    code: "MAT-004",
    price: 400,
  },
  {
    id: 5,
    name: "Material 5",
    code: "MAT-005",
    price: 500,
  }
]

// ! Debe traerse de la API
const taxes = [
  {
    id: 1,
    name: "21%",
    amount: 21,
  },
  {
    id: 2,
    name: "10.5%",
    amount: 10.5,
  },
  {
    id: 3,
    name: "Exento",
    amount: 0,
  }
]

// ! Debe traerse de la API
const currencies = [
  { label: "ARS (Peso argentino)", value: "ARS", id: 1 },
  { label: "COP (Peso colombiano)", value: "COP", id: 2 },
  { label: "USD (Dólar estadounidense)", value: "USD", id: 3 },
] as const;

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
      quantity: 1,
      taxes_id: [],
    });
  }

  const unitPrices = items.map(item => {
    const material = materials.find(material => material.id === item.product_id)
    return material?.price
  }) ?? []

  const subtotal = items.reduce((acc, item, index) => {
    const price = unitPrices[index] ?? 0
    return acc + (price * item.quantity)
  }, 0)

  const subtotalTaxes = items.reduce((acc, item, index) => {
    const price = unitPrices[index] ?? 0
    const taxesAmount = item.taxes_id?.map(taxId => taxes.find(tax => tax.id === taxId)?.amount ?? 0) ?? []
    return acc + (price * item.quantity * taxesAmount.reduce((acc, tax) => acc + tax, 0) / 100)
  }, 0)

  const total = subtotal + subtotalTaxes

  return (
    <ShadcnTableFooter className="border-t-0">
      <TableRow className="!border-b bg-background h-6" />
      <TableRow className="!border-b bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0 text-end">
          <span>Subtotal (Sin imp.)</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          {currencies.find(c => c.id === Number(currency))?.value}{" "}
          <span>
            {subtotal.toFixed(2)}
          </span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
      <TableRow className="!border-b bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0 text-end">
          <span>Impuestos ({subtotal > 0 ? ((subtotalTaxes / subtotal) * 100).toFixed(2) : 0}%)</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          {currencies.find(c => c.id === Number(currency))?.value}{" "}
          <span>
            {subtotalTaxes.toFixed(2)}
          </span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-semibold py-0 text-end">
          <span>Total</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          <span className="font-semibold">
            {currencies.find(c => c.id === Number(currency))?.value}{" "}
          </span>
          <span className="font-semibold">
            {total.toFixed(2)}
          </span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
      <TableRow className="bg-background border-b-0 border-t">
        <TableCell className="h-6 text-xs font-medium py-0 p-0" colSpan={6}>
          <Button
            onClick={handleAddItem}
            size="sm"
            variant="ghost"
            type="button"
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
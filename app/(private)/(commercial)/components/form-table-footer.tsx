import { Button } from "@/components/ui/button"
import {
  TableFooter as ShadFooter,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { useGetCurrencyQuery } from "@/lib/services/currencies"
import { useLazyGetTaxQuery } from "@/lib/services/taxes"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Control, FieldPath, FieldValues, useWatch } from "react-hook-form"

type Props<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
  control: Control<TFieldValues>
  itemsPath: TName
  currencyPath: TName
  unitPriceKey: string
  qtyKey: string
  taxesKey: string
  colSpan: number
  onAddRow?: () => void
  className?: string
}

export function FormTableFooter<FV extends FieldValues = FieldValues>({
  control,
  itemsPath,
  currencyPath,
  unitPriceKey,
  qtyKey,
  taxesKey,
  colSpan,
  className,
  onAddRow,
}: Props<FV>) {
  const items = useWatch({ control, name: itemsPath }) as any[] || []
  const currencyId = useWatch({ control, name: currencyPath }) as number | undefined

  const { data: currency } = useGetCurrencyQuery(currencyId!, { skip: !currencyId })

  const [getTax] = useLazyGetTaxQuery()

  const [taxMap, setTaxMap] = useState<Map<number, number>>(new Map())

  const allTaxIds = items.flatMap((it) => it[taxesKey] as number[] || [])

  const subtotal = items.reduce((s, it) =>
    s + Number(it[qtyKey] || 0) * Number(it[unitPriceKey] || 0), 0)

  const taxTotal = items.reduce((s, it) => {
    const amount = Number(it[unitPriceKey] || 0) * Number(it[qtyKey] || 0)
    const pct = (it[taxesKey] as number[] | undefined)
      ?.reduce((acc, id) => acc + (taxMap.get(id) ?? 0), 0) ?? 0
    return s + amount * pct / 100
  }, 0)

  const total = subtotal + taxTotal

  useEffect(() => {
    const getTaxes = async () => {
      const map = new Map<number, number>()
      for (const id of allTaxIds) {
        try {
          const tax = await getTax(id).unwrap()
          if (tax) map.set(id, tax.amount)
        } catch (e) {
          console.error(`Error fetching tax with ID ${id}:`, e)
        }
      }
      setTaxMap(map)
    }
    getTaxes()
  }, [items])

  return (
    <ShadFooter className={cn("border-t-0", className)}>
      <TableRow className="!border-b bg-background h-6" />

      <TableRow className="!border-b bg-background">
        <TableCell colSpan={colSpan - 1} className="h-6 text-xs py-0 text-end">
          Subtotal&nbsp;(Sin imp.)
        </TableCell>
        <TableCell className="h-6 text-xs py-0 pr-5">
          {currency?.name} {subtotal.toFixed(2)}
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5" />
      </TableRow>

      <TableRow className="!border-b bg-background">
        <TableCell colSpan={colSpan - 1} className="h-6 text-xs py-0 text-end">
          Impuestos&nbsp;(
          {subtotal > 0 ? ((taxTotal / subtotal) * 100).toFixed(2) : 0}%)
        </TableCell>
        <TableCell className="h-6 text-xs py-0 pr-5">
          {currency?.name} {taxTotal.toFixed(2)}
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5" />
      </TableRow>

      <TableRow className="!border-b">
        <TableCell colSpan={colSpan - 1} className="h-6 text-xs py-0 text-end font-semibold">
          Total
        </TableCell>
        <TableCell className="h-6 text-xs py-0 pr-5 font-semibold">
          {currency?.name} {total.toFixed(2)}
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5" />
      </TableRow>

      {onAddRow && (
        <TableRow className="bg-background border-b-0 border-t">
          <TableCell colSpan={colSpan} className="p-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-full rounded-none"
              onClick={onAddRow}
            >
              <Plus className="mr-1.5" /> Agregar item
            </Button>
          </TableCell>
          <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5" />
        </TableRow>
      )}
    </ShadFooter>
  )
}

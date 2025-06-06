import { Button } from "@/components/ui/button"
import {
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table"
import { useGetCurrencyQuery } from "@/lib/services/currencies"
import { useLazyGetTaxQuery } from "@/lib/services/taxes"
import { useSendMessageMutation } from "@/lib/services/telegram"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Control, FieldValues, useWatch } from "react-hook-form"

interface FooterSelectors<FV extends FieldValues, I> {
  items: (values: FV) => readonly I[];
  currencyId?: (values: FV) => number | undefined;
  unitPrice?: (item: I) => number;
  quantity?: (item: I) => number;
  taxes?: (item: I) => readonly number[];
  withholdings?: (values: FV) => readonly number[];
}

interface FormTableFooterProps<FV extends FieldValues, I> {
  control: Control<FV>;
  selectors: FooterSelectors<FV, I>;
  colSpan: number;
  onAddRow?: () => void;
  className?: string;
}

export function FormTableFooter<
  FV extends FieldValues = FieldValues,
  I = unknown
>({
  control,
  selectors,
  colSpan,
  className,
  onAddRow,
}: FormTableFooterProps<FV, I>) {
  const values = useWatch({ control }) as FV
  const items = selectors.items(values) || []

  const currency = useGetCurrencyQuery(
    selectors.currencyId?.(values)!,
    { skip: !selectors.currencyId?.(values) }
  ).data

  const [getTax] = useLazyGetTaxQuery()
  const [sendMessage] = useSendMessageMutation();

  const [taxMap, setTaxMap] = useState<Map<number, number>>(new Map())

  const allTaxIds = [...new Set(items.flatMap(it => selectors.taxes?.(it) || []))]

  const subtotal = items.reduce((s, it) =>
    s + (selectors.quantity?.(it) ?? 0) * (selectors.unitPrice?.(it) ?? 0), 0)

  const taxBreakdown = items.reduce<Map<number, number>>((acc, it) => {
    const base = (selectors.unitPrice?.(it) ?? 0) * (selectors.quantity?.(it) ?? 0)
    for (const id of selectors.taxes?.(it) || []) {
      const pct = taxMap.get(id) ?? 0
      const value = base * pct / 100
      acc.set(id, (acc.get(id) ?? 0) + value)
    }
    return acc
  }, new Map())

  const taxTotal = [...taxBreakdown.values()].reduce((s, v) => s + v, 0)
  const total = subtotal + taxTotal

  useEffect(() => {
    (async () => {
      const map = new Map<number, number>()
      for (const id of allTaxIds) {
        try {
          const tax = await getTax(id).unwrap()
          if (tax) map.set(id, tax.amount)
        } catch (e) {
          sendMessage({
            location: "app/(private)/(commercial)/components/form-table-footer.tsx",
            rawError: e,
            fnLocation: "useEffect"
          }).unwrap().catch((error) => {
            console.error(error);
          });
        }
      }
      setTaxMap(map)
    })()
  }, [JSON.stringify(allTaxIds)])

  return (
    <TableFooter className={cn("border-t-0", className)}>
      <TableRow className="!border-b bg-background h-6" />

      {selectors.unitPrice && selectors.quantity && (
        <TableRow className="!border-b bg-background">
          <TableCell colSpan={colSpan - 1} className="h-6 text-xs py-0 text-end">
            Subtotal&nbsp;(sin impuestos)
          </TableCell>
          <TableCell className="h-6 text-xs py-0 pr-5">
            {currency?.name} {subtotal.toFixed(2)}
          </TableCell>
          <TableCell className="h-6 text-xs py-0 pr-5" />
        </TableRow>
      )}

      {Array.from(taxBreakdown.entries()).map(([id, amount]) => (
        <TableRow key={`tax-${id}`} className="!border-b bg-background">
          <TableCell colSpan={colSpan - 1} className="h-6 text-xs py-0 text-end">
            Impuesto&nbsp;({(taxMap.get(id) ?? 0).toFixed(2)}%)
          </TableCell>
          <TableCell className="h-6 text-xs py-0 pr-5">
            {currency?.name} {amount.toFixed(2)}
          </TableCell>
          <TableCell className="h-6 text-xs py-0 pr-5" />
        </TableRow>
      ))}

      {selectors.unitPrice && selectors.quantity && (
        <TableRow className="!border-b">
          <TableCell colSpan={colSpan - 1} className="h-6 text-xs py-0 text-end font-semibold">
            Total
          </TableCell>
          <TableCell className="h-6 text-xs py-0 pr-5 font-semibold">
            {currency?.name} {total.toFixed(2)}
          </TableCell>
          <TableCell className="h-6 text-xs py-0 pr-5" />
        </TableRow>
      )}

      {onAddRow && (
        <TableRow className="bg-background border-b-0 border-t">
          <TableCell colSpan={colSpan + 1} className="p-0">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-7 w-full rounded-none bg-sidebar"
              onClick={onAddRow}
            >
              <Plus />
              Agregar línea
            </Button>
          </TableCell>
        </TableRow>
      )}
    </TableFooter>
  )
}

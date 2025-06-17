import { Control, FieldPath, FieldValues, useWatch } from "react-hook-form"
import { cn, formatNumber } from "@/lib/utils"
import { useGetCurrencyQuery } from "@/lib/services/currencies"

type Props<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
  control: Control<TFieldValues>
  currencyPath: TName
  priceUnitPath: TName
  quantityPath: TName
  precision?: number
  className?: string
}

export function SubtotalField<TFieldValues extends FieldValues = FieldValues>({
  control,
  currencyPath,
  priceUnitPath,
  quantityPath,
  precision = 2,
  className,
}: Props<TFieldValues>) {
  const currencyId = useWatch({ control, name: currencyPath })
  const priceUnit = useWatch({ control, name: priceUnitPath }) || 0
  const quantity = useWatch({ control, name: quantityPath }) || 0

  const subtotal = quantity * priceUnit

  const { data: currency, isLoading } = useGetCurrencyQuery(currencyId!, {
    skip: !currencyId,
  })

  return (
    <span className={cn("inline-flex gap-1", className)}>
      {isLoading ? "…" : currency?.name ?? ""}{" "}
      <span>{formatNumber(subtotal, { minimumFractionDigits: precision, maximumFractionDigits: precision })}</span>
    </span>
  )
}

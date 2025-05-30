// components/tax-multi-select-field.tsx
import { Control, FieldPath, FieldValues, useFormContext } from "react-hook-form"
import { FormField, FormItem, FormControl } from "@/components/ui/form"
import { AsyncMultiSelect } from "@/components/async-multi-select"
import { cn } from "@/lib/utils"
import { useTaxSelect } from "../hooks/use-tax-select"

type TaxOption = { id: number; name: string }

type Props<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
  control: Control<TFieldValues>
  name: TName
  onChange?: (values: number[]) => void
  type_tax_use: "sale" | "purchase"
}

export function TaxSelectField<FV extends FieldValues = FieldValues>({
  control,
  name,
  onChange,
  type_tax_use
}: Props<FV>) {
  const {
    formState: { errors },
  } = useFormContext<FV>()

  const currentIds = control._getWatch(name) as unknown as number[] | undefined
  const { initialOptions, fetcher } = useTaxSelect({ taxIds: currentIds, type_tax_use })

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col w-[200px]">
          <FormControl>
            <AsyncMultiSelect<TaxOption, number>
              placeholder="Buscar impuesto…"
              className={cn(
                "!w-full rounded-none border-none shadow-none bg-transparent pl-4",
                errors && "outline-destructive",
              )}
              fetcher={fetcher}
              initialOptions={initialOptions}
              defaultValue={field.value}
              value={field.value}
              getOptionValue={(o) => o.id}
              getOptionKey={(o) => String(o.id)}
              renderOption={(o) => <>{o.name}</>}
              getDisplayValue={(o) => <>{o.name}</>}
              noResultsMessage="No se encontraron resultados"
              onValueChange={(vals) => {
                field.onChange(vals)
                onChange?.(vals)
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

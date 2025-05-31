import { Control, FieldPath, FieldValues } from "react-hook-form"
import { FormField, FormItem, FormControl } from "@/components/ui/form"
import { AsyncSelect } from "@/components/async-select"
import { cn } from "@/lib/utils"
import { useCostCenterSelect } from "../hooks/use-cost-center-select"
import { get } from "lodash"

type CenterOption = { id: number; name: string }

type Props<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
  control: Control<TFieldValues>
  name: TName
  onSelect?: (id: number | undefined, option?: CenterOption) => void
  width?: number
}

export function CostCenterSelectField<FV extends FieldValues = FieldValues>({
  control,
  name,
  onSelect,
  width = 200,
}: Props<FV>) {
  const currentId = (control._getWatch(name) as unknown as number | undefined) ?? undefined
  const { initialOptions, fetcher } = useCostCenterSelect({
    costCenterId: currentId,
  })

  const fieldError = get(control._formState.errors, name);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col" style={{ width }}>
          <FormControl>
            <AsyncSelect<CenterOption, number | undefined>
              label="Centro de costo"
              placeholder="Buscar centro de costo…"
              fetcher={fetcher}
              initialOptions={initialOptions}
              value={field.value}
              getOptionValue={(o) => o.id}
              getOptionKey={(o) => String(o.id)}
              renderOption={(o) => <>{o.name}</>}
              getDisplayValue={(o) => o.name}
              onChange={(id, opt) => {
                field.onChange(id)
                onSelect?.(id, opt)
              }}
              noResultsMessage="No se encontraron resultados"
              triggerClassName={cn(
                "!w-full rounded-none border-none shadow-none bg-transparent pl-4 min-w-[200px]",
                fieldError && "outline outline-1 outline-offset-[-1px] outline-destructive"
              )}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

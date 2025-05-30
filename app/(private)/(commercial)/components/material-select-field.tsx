import { AsyncSelect } from "@/components/async-select"
import { FormControl, FormField, FormItem } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { useMaterialSelect } from "../hooks/use-material-select"

type MaterialOption = { id: number; name: string; code?: string; standard_price: number }

type Props<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
  control: Control<TFieldValues>
  name: TName
  onSelect?: (value: number, option?: MaterialOption) => void
}

export function MaterialSelectField<FV extends FieldValues = FieldValues>({
  control,
  name,
  onSelect
}: Props<FV>) {
  const fieldId = control._getWatch(name)

  const { initialOptions, fetcher } = useMaterialSelect({ productId: fieldId })

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col w-full">
          <FormControl>
            <AsyncSelect<MaterialOption, number>
              label="Producto o servicio"
              placeholder="Buscar producto o servicio…"
              triggerClassName={cn(
                "!w-full rounded-none border-none shadow-none bg-transparent pl-4",
                control._formState.errors && "outline-destructive",
              )}
              fetcher={fetcher}
              getDisplayValue={i => <div className="flex gap-1">{i.code && <><span className="font-medium">{i.code}</span>-</>}{" "}{i.name}</div>}
              renderOption={i => <div className="flex gap-1">{i.code && <><span className="font-medium">{i.code}</span>-</>}{" "}{i.name}</div>}
              getOptionValue={(i) => i.id}
              getOptionKey={(i) => String(i.id)}
              value={field.value}
              onChange={(value, option) => {
                field.onChange(value)
                onSelect?.(value, option)
              }}
              creatable={{
                label: (input) => <>Añadir nuevo material &quot;{input}&quot;</>,
                onCreate: (input) => {
                  console.log("Crear material con nombre:", input)
                },
              }}
              noResultsMessage="No se encontraron resultados"
              initialOptions={initialOptions}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

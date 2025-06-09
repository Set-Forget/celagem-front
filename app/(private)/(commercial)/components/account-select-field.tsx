import { Control, FieldPath, FieldValues } from "react-hook-form"
import { cn } from "@/lib/utils"
import { FormField, FormItem, FormControl } from "@/components/ui/form"
import { AsyncSelect } from "@/components/async-select"
import { useAccountingAccountSelect } from "../hooks/use-account-select"
import { get } from "lodash"

type AccountOption = { id: number; name: string; code: string }

type Props<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
  control: Control<TFieldValues>
  name: TName
  onSelect?: (id: number, option?: AccountOption) => void
  width?: number
  align?: "start" | "center" | "end"
  accountTypes?: string[]
}

export function AccountSelectField<FV extends FieldValues = FieldValues>({
  control,
  name,
  onSelect,
  width = 200,
  align = "end",
  accountTypes,
}: Props<FV>) {
  const currentId = (control._getWatch(name) as unknown as number | undefined) ?? undefined

  const { initialOptions, fetcher } = useAccountingAccountSelect({
    accountId: currentId,
    accountTypes,
  })

  const fieldError = get(control._formState.errors, name);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col" style={{ width }}>
          <FormControl>
            <AsyncSelect<AccountOption, number>
              label="Cuenta contable"
              placeholder="Buscar cuenta contable…"
              fetcher={fetcher}
              initialOptions={initialOptions}
              value={field.value}
              getOptionValue={(o) => o.id}
              getOptionKey={(o) => String(o.id)}
              renderOption={(o) => (
                <div className="truncate">
                  <span className="font-medium">{o.code}</span> - {o.name}
                </div>
              )}
              getDisplayValue={(o) => (
                <div className="flex gap-1">
                  <span className="font-medium">{o.code}</span> - {o.name}
                </div>
              )}
              onChange={(id, opt) => {
                field.onChange(id)
                onSelect?.(id, opt)
              }}
              triggerClassName={cn(
                "!w-full rounded-none border-none shadow-none bg-transparent pl-4",
                fieldError && "outline outline-1 outline-offset-[-1px] outline-destructive"
              )}
              noResultsMessage="No se encontraron resultados"
              align={align}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

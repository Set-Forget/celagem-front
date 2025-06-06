import { AsyncSelect } from "@/components/async-select"
import { FormControl, FormField, FormItem } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { Control, FieldPath, FieldValues, useFormContext } from "react-hook-form"
import { useMaterialSelect } from "../hooks/use-material-select"
import { get } from "lodash"

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
  const { setValue } = useFormContext<FV>()

  const fieldId = control._getWatch(name)

  const { initialOptions, fetcher } = useMaterialSelect({ productId: fieldId })

  const fieldError = get(control._formState.errors, name);

  const handleCreateProduct = async (input: string) => {
    const response = await fetch("/jsonrpc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "call",
        "params": {
          "service": "object",
          "method": "execute_kw",
          "args": [
            "ciro",
            2,
            "admin",
            "product.product",
            "name_create",
            [`${input}`],
            {}
          ]
        }
      }),
    });
    const data = await response.json();
    const newProductId = data?.result?.[0] as number;
    setValue(name, newProductId as FV[typeof name], { shouldValidate: true });
  }

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
              className="w-[400px]"
              triggerClassName={cn(
                "!w-full rounded-none border-none shadow-none bg-transparent pl-4",
                fieldError && "outline outline-1 outline-offset-[-1px] outline-destructive"
              )}
              fetcher={fetcher}
              getDisplayValue={i => <div className="flex gap-1">{i.code && <><span className="font-medium">{i.code}</span>-</>}{" "}{i.name}</div>}
              renderOption={i => <div className="flex gap-1">{i.code && <>
                <span className="font-medium text-nowrap">
                  {i.code}
                </span>-
              </>}
                {" "}<p className="truncate">{i.name}</p>
              </div>}
              getOptionValue={(i) => i.id}
              getOptionKey={(i) => String(i.id)}
              value={field.value}
              onChange={(value, option) => {
                field.onChange(value)
                onSelect?.(value, option)
              }}
              creatable={{
                label: (input) => <>Añadir &quot;{input}&quot;</>,
                onCreate: (input) => {
                  handleCreateProduct(input)
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

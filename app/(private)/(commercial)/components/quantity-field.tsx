import { Control, FieldPath, FieldValues } from "react-hook-form"
import { FormField, FormItem, FormControl } from "@/components/ui/form"
import { Button as AriaButton, Input as AriaInput, Label as AriaLabel, Group, NumberField } from "react-aria-components";
import {
  ChevronUpIcon,
  ChevronDownIcon,
} from "lucide-react"

type Props<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
  control: Control<TFieldValues>
  name: TName
  min?: number
  max?: number
  onChange?: (value: number | undefined) => void
  className?: string
}

export function QuantityField<FV extends FieldValues = FieldValues>({
  control,
  name,
  min = 0,
  max,
  onChange,
  className,
}: Props<FV>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormControl>
            <NumberField
              minValue={min}
              maxValue={max}
              value={field.value}
              onChange={(val) => {
                field.onChange(val)
                onChange?.(val)
              }}
            >
              <div className="*:not-first:mt-2">
                <AriaLabel className="sr-only">Cantidad</AriaLabel>
                <Group className="rounded-none border-none outline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden border text-sm whitespace-nowrap transition-[color,box-shadow] data-disabled:opacity-50 justify-between">
                  <AriaInput className="text-end bg-transparent text-foreground w-full px-3 py-2 tabular-nums rounded-none border-none focus-visible:outline focus-visible:outline-ring focus-visible:!outline-offset-[-1px]" />
                  <div className="flex h-[calc(100%+2px)] flex-col">
                    <AriaButton
                      slot="increment"
                      className="!border-r-2 border-l px-1 rounded-none bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronUpIcon size={14} aria-hidden="true" />
                    </AriaButton>
                    <AriaButton
                      slot="decrement"
                      className="!border-r-2 border-l px-1 rounded-none bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronDownIcon size={14} aria-hidden="true" />
                    </AriaButton>
                  </div>
                </Group>
              </div>
            </NumberField>
          </FormControl>
        </FormItem>
      )}
    />
  )
}

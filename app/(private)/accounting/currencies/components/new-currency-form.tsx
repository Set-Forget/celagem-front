import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button as AriaButton, Input as AriaInput, Label as AriaLabel, Group, NumberField } from "react-aria-components";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { newCurrencySchema } from "../schema/currencies";

export default function NewCurrencyForm() {
  const { control } = useFormContext<z.infer<typeof newCurrencySchema>>()

  return (
    <form className="gap-4 grid grid-cols-2">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Nombre</FormLabel>
            <FormControl>
              <Input
                placeholder="USD"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="symbol"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Símbolo</FormLabel>
            <FormControl>
              <Input
                placeholder="$"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="rate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="w-fit">Unidad por USD</FormLabel>
            <FormControl>
              <NumberField
                minValue={0}
                onChange={field.onChange}
                value={field.value}
              >
                <div className="*:not-first:mt-2">
                  <AriaLabel className="sr-only">Monto</AriaLabel>
                  <Group className="border-border outline-none data-[focus-within]:border-ring data-[focus-within]:ring-ring/50 data-[focus-within]:has-aria-invalid:ring-destructive/20 dark:data-[focus-within]:has-aria-invalid:ring-destructive/40 data-[focus-within]:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden rounded-sm border text-sm whitespace-nowrap shadow-sm transition-[color,box-shadow]">
                    <AriaInput
                      placeholder="1000"
                      className="bg-background text-foreground flex-1 px-3 py-2 tabular-nums outline-none placeholder:text-muted-foreground"
                    />
                    <div className="flex h-[calc(100%+2px)] flex-col">
                      <AriaButton
                        slot="increment"
                        className="border-border bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronUpIcon size={14} aria-hidden="true" />
                      </AriaButton>
                      <AriaButton
                        slot="decrement"
                        className="border-border bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronDownIcon size={14} aria-hidden="true" />
                      </AriaButton>
                    </div>
                  </Group>
                </div>
              </NumberField>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </form>
  )
}
import { AccountSelectField } from "@/app/(private)/(commercial)/components/account-select-field";
import { FormTableColumn } from "@/components/form-table";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useListCurrenciesQuery } from "@/lib/services/currencies";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button as AriaButton, Input as AriaInput, Label as AriaLabel, Group, NumberField } from "react-aria-components";
import { Control, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import { newJournalEntrySchema } from "../../schemas/journal-entries";

const DebitCell = ({ control, index }: { control: Control<z.infer<typeof newJournalEntrySchema>>; index: number }) => {
  const { setValue } = useFormContext<z.infer<typeof newJournalEntrySchema>>()

  const { data: currencies } = useListCurrenciesQuery()

  const currency = useWatch({
    control,
    name: "currency",
  });

  return <FormField
    control={control}
    name={`items.${index}.debit`}
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormControl>
          <NumberField
            minValue={0}
            onChange={(value) => {
              field.onChange(value)
              setValue(`items.${index}.credit`, 0, { shouldValidate: true })
            }}
            value={field.value}
            formatOptions={
              currency
                ? {
                  style: "currency",
                  currency: currencies?.data?.find((c) => c.id === currency)?.name,
                  currencyDisplay: "code",
                }
                : undefined
            }
          >
            <div className="*:not-first:mt-2">
              <AriaLabel className="sr-only">Debe</AriaLabel>
              <Group className="rounded-none border-none outline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden border text-sm whitespace-nowrap transition-[color,box-shadow] data-disabled:opacity-50 justify-between">
                <AriaInput className={cn("text-end bg-transparent text-foreground w-full px-3 py-2 tabular-nums rounded-none border-none focus-visible:outline focus-visible:outline-ring focus-visible:!outline-offset-[-1px]",
                  control._formState.errors.items?.[index]?.debit && "outline outline-1 outline-offset-[-1px] outline-destructive")
                } />
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
};

const CreditCell = ({ control, index }: { control: Control<z.infer<typeof newJournalEntrySchema>>; index: number }) => {
  const { setValue } = useFormContext<z.infer<typeof newJournalEntrySchema>>()

  const { data: currencies } = useListCurrenciesQuery()

  const currency = useWatch({
    control,
    name: "currency",
  });

  return <FormField
    control={control}
    name={`items.${index}.credit`}
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormControl>
          <NumberField
            minValue={0}
            onChange={(value) => {
              field.onChange(value)
              setValue(`items.${index}.debit`, 0, { shouldValidate: true })
            }}
            value={field.value}
            formatOptions={
              currency
                ? {
                  style: "currency",
                  currency: currencies?.data?.find((c) => c.id === currency)?.name,
                  currencyDisplay: "code",
                }
                : undefined
            }
          >
            <div className="*:not-first:mt-2">
              <AriaLabel className="sr-only">Haber</AriaLabel>
              <Group className="rounded-none border-none outline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden border text-sm whitespace-nowrap transition-[color,box-shadow] data-disabled:opacity-50 justify-between">
                <AriaInput className={cn("text-end bg-transparent text-foreground w-full px-3 py-2 tabular-nums rounded-none border-none focus-visible:outline focus-visible:outline-ring focus-visible:!outline-offset-[-1px]",
                  control._formState.errors.items?.[index]?.credit && "outline outline-1 outline-offset-[-1px] outline-destructive")
                } />
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
};

const RefCell = ({ control, index }: { control: Control<z.infer<typeof newJournalEntrySchema>>; index: number }) => {
  return <FormField
    control={control}
    name={`items.${index}.name`}
    render={({ field }) => (
      <FormItem className="flex flex-col w-full">
        <FormControl>
          <Input
            type="text"
            className={cn(
              "w-full rounded-none border-none shadow-none bg-transparent pl-4",
              control._formState.errors.items?.[index]?.name && "outline outline-1 outline-offset-[-1px] outline-destructive"
            )}
            {...field}
          />
        </FormControl>
      </FormItem>
    )}
  />
}

export const columns: FormTableColumn<z.infer<typeof newJournalEntrySchema>>[] = [
  {
    header: "Cuenta contable",
    width: 300,
    cellClassName: "pr-0",
    renderCell: (
      control,
      index,
    ) => <AccountSelectField
        control={control}
        name={`items.${index}.account_id`}
        width={300}
      />,
  },
  {
    header: "Ref/Descripción",
    width: 300,
    cellClassName: "pr-0",
    renderCell: (control, index) => <RefCell control={control} index={index} />,
  },
  {
    header: "Debe",
    width: 150,
    cellClassName: "pr-0",
    renderCell: (control, index) => <DebitCell control={control} index={index} />,
  },
  {
    header: "Haber",
    width: 150,
    cellClassName: "pr-0 border-l-0",
    renderCell: (control, index) => <CreditCell control={control} index={index} />,
  },
]
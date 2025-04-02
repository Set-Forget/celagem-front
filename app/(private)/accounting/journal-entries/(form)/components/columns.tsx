import { FormTableColumn } from "@/components/form-table";
import { z } from "zod";
import { newJournalEntrySchema } from "../../schemas/journal-entries";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { AsyncSelect } from "@/components/async-select";
import { cn } from "@/lib/utils";
import { Control, useFormContext, useWatch } from "react-hook-form";
import { useLazyListAccountingAccountsQuery } from "@/lib/services/accounting-accounts";
import { AsyncMultiSelect } from "@/components/async-multi-select";
import { useLazyListTaxesQuery } from "@/lib/services/taxes";
import { Button as AriaButton, Input as AriaInput, Label as AriaLabel, Group, NumberField } from "react-aria-components";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useListCurrenciesQuery } from "@/lib/services/currencies";

const AccountingAccountCell = ({ control, index }: { control: Control<z.infer<typeof newJournalEntrySchema>>; index: number }) => {
  const [searchAccountingAccounts] = useLazyListAccountingAccountsQuery()

  const handleSearchAccountingAccount = async (query?: string) => {
    try {
      const response = await searchAccountingAccounts({ name: query }).unwrap()
      return response.data?.map(account => ({
        id: account.id,
        name: account.name,
        code: account.code
      }))
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  return <FormField
    control={control}
    name={`items.${index}.account_id`}
    render={({ field }) => (
      <FormItem className="flex flex-col w-full">
        <FormControl>
          <AsyncSelect<{ id: number, name: string, code: string }, number>
            label="Cuenta contable"
            triggerClassName={cn(
              "!w-full rounded-none border-none shadow-none bg-transparent pl-4",
              control._formState.errors.items?.[index]?.account_id && "outline outline-1 outline-offset-[-1px] outline-destructive"
            )}
            placeholder="Buscar cuenta contable..."
            fetcher={handleSearchAccountingAccount}
            getDisplayValue={(item) => `${item.code} - ${item.name}`}
            getOptionValue={(item) => item.id}
            renderOption={(item) => <div>{item.code} - {item.name}</div>}
            onChange={field.onChange}
            value={field.value}
            getOptionKey={(item) => String(item.id)}
            noResultsMessage="No se encontraron resultados"
          />
        </FormControl>
      </FormItem>
    )}
  />
}

const TaxesCell = ({ control, index }: { control: Control<z.infer<typeof newJournalEntrySchema>>; index: number }) => {
  const { setValue } = useFormContext<z.infer<typeof newJournalEntrySchema>>()

  const [searchTaxes] = useLazyListTaxesQuery()

  const handleSearchTax = async (query?: string) => {
    try {
      const response = await searchTaxes({
        name: query,
        type_tax_use: "purchase"
      }).unwrap()
      return response.data?.map(taxes => ({
        id: taxes.id,
        name: taxes.name
      }))
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  return <FormField
    control={control}
    name={`items.${index}.taxes_id`}
    render={({ field }) => (
      <FormItem className="flex flex-col w-full">
        <FormControl>
          <AsyncMultiSelect<{ id: number, name: string }, number>
            className={cn(
              "!w-full rounded-none border-none shadow-none bg-transparent pl-4",
              control._formState.errors.items?.[index]?.taxes_id && "outline outline-1 outline-offset-[-1px] outline-destructive"
            )}
            placeholder="Buscar impuesto..."
            fetcher={handleSearchTax}
            getDisplayValue={(item) => (
              <div className="flex gap-1">
                {item.name}
              </div>
            )}
            getOptionValue={(item) => item.id}
            renderOption={(item) => <>{item.name}</>}
            onValueChange={(value) => {
              field.onChange(value);
              setValue(`items.${index}.taxes_id`, value, { shouldValidate: true });
            }}
            value={field.value}
            getOptionKey={(item) => String(item.id)}
            noResultsMessage="No se encontraron resultados"
          />
        </FormControl>
      </FormItem>
    )}
  />
}

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

export const columns: FormTableColumn<z.infer<typeof newJournalEntrySchema>>[] = [
  {
    header: "Cuenta contable",
    width: 300,
    cellClassName: "pr-0",
    renderCell: (
      control,
      index,
    ) => <AccountingAccountCell control={control} index={index} />,
  },
  {
    header: "Impuestos",
    width: 200,
    cellClassName: "pr-0 border-l-0",
    renderCell: (control, index) => <TaxesCell control={control} index={index} />,
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
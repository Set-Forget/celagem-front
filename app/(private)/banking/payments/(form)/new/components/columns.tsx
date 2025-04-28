import { billStatus } from "@/app/(private)/purchases/bills/utils";
import { AsyncMultiSelect } from "@/components/async-multi-select";
import { AsyncSelect } from "@/components/async-select";
import { FormTableColumn } from "@/components/form-table";
import { Badge } from "@/components/ui/badge";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { useLazyListBillsQuery, useListBillsQuery } from "@/lib/services/bills";
import { useListCurrenciesQuery } from "@/lib/services/currencies";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button as AriaButton, Input as AriaInput, Label as AriaLabel, Group, NumberField } from "react-aria-components";
import { Control, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import { newPaymentSchema } from "../../../schemas/payments";

export const withholdings = [
  {
    id: 1,
    name: "10%",
    amount: 10
  },
  {
    id: 2,
    name: "21%",
    amount: 21
  },
  {
    id: 3,
    name: "27%",
    amount: 27
  },
]

const BillsCell = ({ control, index }: { control: Control<z.infer<typeof newPaymentSchema>>; index: number }) => {
  const { setValue } = useFormContext<z.infer<typeof newPaymentSchema>>()

  const [searchBills] = useLazyListBillsQuery()

  const handleSearchInvoice = async (query?: string) => {
    try {
      const response = await searchBills({
        number: query,
        status: "posted"
      }).unwrap()
      return response.data?.map(bill => ({
        id: bill.id,
        name: bill.number,
        status: bill.status,
        due_date: bill.due_date,
        amount_total: bill.amount_total,
        supplier: bill.supplier,
        currency: bill.currency,
      }))
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  return <FormField
    control={control}
    name={`invoices.${index}.invoice_id`}
    render={({ field }) => (
      <FormItem className="flex flex-col w-full">
        <FormControl>
          <AsyncSelect<{ id: number, name: string, status: string, due_date: string, amount_total: number, supplier: string, currency: string }, number>
            label="Factura"
            triggerClassName={cn(
              "!w-full rounded-none border-none shadow-none bg-transparent pl-4",
              control._formState.errors.invoices?.[index]?.invoice_id && "outline outline-1 outline-offset-[-1px] outline-destructive"
            )}
            className="w-fit"
            placeholder="Buscar factura..."
            fetcher={handleSearchInvoice}
            getDisplayValue={(item) => {
              return <div className="flex gap-2">
                <span className="font-medium">
                  {item.name}
                </span>
              </div>
            }}
            getOptionValue={(item) => item.id}
            renderOption={(item) => {
              const status = billStatus[item.status === "posted" && new Date(item.due_date) < new Date() ? "overdue" : item.status as keyof typeof billStatus];
              return <div className="grid grid-cols-[150px,100px,100px,auto] gap-4 items-center w-full">
                <p className="font-medium truncate">
                  {item.name}
                </p>
                <p className="max-w-[150px] truncate">
                  {item.supplier}
                </p>
                <div>
                  <Badge
                    variant="custom"
                    className={cn(`${status?.bg_color} ${status?.text_color} border-none rounded-sm`)}
                  >
                    {status?.label}
                  </Badge>
                </div>
                <span className="text-sm">
                  {item.currency}{" "}
                  {item.amount_total}
                </span>
              </div>
            }}
            onChange={async (value, item) => {
              field.onChange(value)
              setValue(`invoices.${index}.amount`, item.amount_total, { shouldValidate: true });
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

const SupplierCell = ({ control, index }: { control: Control<z.infer<typeof newPaymentSchema>>; index: number }) => {
  const { data: bills } = useListBillsQuery()

  const bill = useWatch({
    control,
    name: `invoices.${index}.invoice_id`,
  });

  return (
    <div className="px-4">
      <span className="text-nowrap">{bills?.data.find((i) => i.id === bill)?.supplier}</span>
    </div>
  );
}

const CurrentBalanceCell = ({ control, index }: { control: Control<z.infer<typeof newPaymentSchema>>; index: number }) => {
  const { data: bills } = useListBillsQuery()

  const bill = useWatch({
    control,
    name: `invoices.${index}.invoice_id`,
  });

  return (
    <div className="px-4 text-nowrap">
      {bills?.data.find((c) => c.id === bill)?.currency}{" "}
      <span>{bills?.data.find((i) => i.id === bill)?.amount_total}</span>
    </div>
  );
}

const WithholdingsCell = ({ control, index }: { control: Control<z.infer<typeof newPaymentSchema>>; index: number }) => {
  //const [searchTaxes] = useLazyListTaxesQuery()

  const handleSearchWithholding = async (query?: string) => {
    try {
      return withholdings
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  return <FormField
    control={control}
    name={`invoices.${index}.withholding_ids`}
    render={({ field }) => (
      <FormItem className="flex flex-col w-full">
        <FormControl>
          <AsyncMultiSelect<{ id: number, name: string }, number>
            className={cn(
              "!w-full rounded-none border-none shadow-none bg-transparent pl-4",
              control._formState.errors.invoices?.[index]?.withholding_ids && "outline outline-1 outline-offset-[-1px] outline-destructive"
            )}
            placeholder="Retenciones"
            fetcher={handleSearchWithholding}
            getDisplayValue={(item) => (
              <div className="flex gap-1">
                {item.name}
              </div>
            )}
            getOptionValue={(item) => item.id}
            renderOption={(item) => <>{item.name}</>}
            onValueChange={(value) => {
              field.onChange(value);
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

const AmountCell = ({ control, index }: { control: Control<z.infer<typeof newPaymentSchema>>; index: number }) => {
  const { data: bills } = useListBillsQuery()

  const bill_id = useWatch({
    control,
    name: `invoices.${index}.invoice_id`,
  });

  return <FormField
    control={control}
    name={`invoices.${index}.amount`}
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormControl>
          <NumberField
            minValue={0}
            onChange={field.onChange}
            value={field.value}
            formatOptions={
              bills?.data.find((c) => c.id === bill_id)?.currency
                ? {
                  style: "currency",
                  currency: bills?.data.find((c) => c.id === bill_id)?.currency,
                  currencyDisplay: "code",
                }
                : undefined
            }
          >
            <div className="*:not-first:mt-2">
              <AriaLabel className="sr-only">Precio unitario</AriaLabel>
              <Group className="rounded-none border-none outline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden border text-sm whitespace-nowrap transition-[color,box-shadow] data-disabled:opacity-50 justify-between">
                <AriaInput className={cn("text-start bg-transparent text-foreground w-full px-4 py-2 tabular-nums rounded-none border-none focus-visible:outline focus-visible:outline-ring focus-visible:!outline-offset-[-1px]",
                  control._formState.errors.invoices?.[index]?.amount && "outline outline-1 outline-offset-[-1px] outline-destructive"
                )} />
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

const PendingBalanceCell = ({ control, index }: { control: Control<z.infer<typeof newPaymentSchema>>; index: number }) => {
  const { data: bills } = useListBillsQuery()

  const amount = useWatch({
    control,
    name: `invoices.${index}.amount`,
  });

  const bill_id = useWatch({
    control,
    name: `invoices.${index}.invoice_id`,
  });

  const withholding_ids = useWatch({
    control,
    name: `invoices.${index}.withholding_ids`,
  });

  const totalWithholdings = withholding_ids?.reduce((acc, withholdingId) => {
    const withholding = withholdings.find(w => w.id === withholdingId)
    return acc + (withholding ? (amount * (withholding.amount / 100)) : 0);
  }, 0) || 0;

  const pendingAmount = ((bills?.data.find((c) => c.id === bill_id)?.amount_total || 0) - (amount || 0) + totalWithholdings).toFixed(2);

  return (
    <div className="px-4 text-nowrap">
      {bills?.data.find((c) => c.id === bill_id)?.currency}{" "}
      <span>{pendingAmount}</span>
    </div>
  );
}

export const columns: FormTableColumn<z.infer<typeof newPaymentSchema>>[] = [
  {
    header: "Factura",
    cellClassName: "pr-0 border-r",
    renderCell: (control, index) => <BillsCell control={control} index={index} />,
  },
  {
    header: "Proveedor",
    align: "left",
    cellClassName: "w-[150px] border-l-0",
    renderCell: (control, index) => <SupplierCell control={control} index={index} />,
  },
  {
    header: "Total a pagar",
    align: "left",
    cellClassName: "w-[150px]",
    headerClassName: "text-nowrap",
    renderCell: (control, index) => <CurrentBalanceCell control={control} index={index} />,
  },
  {
    header: "Retenciones",
    align: "left",
    cellClassName: "pr-0 w-[150px]",
    renderCell: (control, index) => <WithholdingsCell control={control} index={index} />,
  },
  {
    header: "Importe",
    align: "left",
    cellClassName: "w-[150px]",
    renderCell: (control, index) => <AmountCell control={control} index={index} />
  },
  {
    header: "Saldo pendiente",
    align: "left",
    cellClassName: "w-[100px] border-l-0",
    headerClassName: "text-nowrap",
    renderCell: (control, index) => <PendingBalanceCell control={control} index={index} />,
  }
];

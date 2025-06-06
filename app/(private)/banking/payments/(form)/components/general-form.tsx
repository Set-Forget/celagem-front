import { useCurrencySelect } from "@/app/(private)/(commercial)/hooks/use-currency-select"
import { usePaymentMethodSelect } from "@/app/(private)/(commercial)/hooks/use-payment-method-select"
import { useSupplierSelect } from "@/app/(private)/(commercial)/hooks/use-supplier-select"
import { AsyncSelect } from "@/components/async-select"
import { DataTable } from "@/components/data-table"
import DatePicker from "@/components/date-picker"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLazyGetBillQuery } from "@/lib/services/bills"
import { useLazyGetSupplierQuery, useLazyGetSupplierWithholdingsQuery } from "@/lib/services/suppliers"
import { cn, createApply } from "@/lib/utils"
import { getLocalTimeZone, today } from "@internationalized/date"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Button as AriaButton, Input as AriaInput, Label as AriaLabel, Group, NumberField } from "react-aria-components"
import { useFormContext, useWatch } from "react-hook-form"
import { z } from "zod"
import { newPaymentSchema } from "../../schemas/payments"
import { columns } from "./columns"
import TableFooter from "./table-footer"
import { AsyncMultiSelect } from "@/components/async-multi-select"
import { useTaxSelect } from "@/app/(private)/(commercial)/hooks/use-tax-select"

export default function GeneralForm() {
  const searchParams = useSearchParams()

  const { control, formState, setValue, resetField } = useFormContext<z.infer<typeof newPaymentSchema>>()

  const [currency, setCurrency] = useState<{ id: number, name: string } | undefined>(undefined)

  const billIds = searchParams.get("bill_ids")

  const [getBill, { isLoading: isLoadingBills }] = useLazyGetBillQuery()

  const [getSupplier] = useLazyGetSupplierQuery()
  const [getSupplierWithholdings] = useLazyGetSupplierWithholdingsQuery()

  const { initialOptions: initialPaymentMethod, fetcher: handleSearchPaymentMethod } = usePaymentMethodSelect({
    paymentMethodId: control._getWatch("payment_method"),
    paymentType: "outbound"
  })
  const { initialOptions: initialCurrency, fetcher: handleSearchCurrency } = useCurrencySelect({
    currencyId: control._getWatch("currency"),
  })
  const { initialOptions: initialSupplier, fetcher: handleSearchSupplier } = useSupplierSelect({
    supplierId: control._getWatch("partner"),
  })
  const { initialOptions: initialTaxes, fetcher } = useTaxSelect({
    taxIds: control._getWatch("withholdings"),
    type_tax_use: "purchase"
  })

  const bills = useWatch({ control, name: "invoices" })
  const apply = useMemo(
    () => createApply<z.infer<typeof newPaymentSchema>>(setValue, resetField),
    [setValue, resetField]
  );

  useEffect(() => {
    if (billIds) {
      (async () => {
        const ids = billIds.split(",").map((id) => Number(id))
        const bills = await Promise.all(ids.map((id) => getBill(id).unwrap()))
        const withholdings = await getSupplierWithholdings(bills[0]?.supplier.id!).unwrap()

        setValue("invoices", bills)
        apply("withholdings", withholdings?.map((w) => w.id) || [])
      })()
    }
  }, [billIds])

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {!billIds && (
        <FormField
          control={control}
          name="partner"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Proveedor</FormLabel>
              <AsyncSelect<{ id: number, name: string }, number | undefined>
                label="Proveedor"
                triggerClassName="!w-full"
                placeholder="Seleccionar proveedor..."
                fetcher={handleSearchSupplier}
                getDisplayValue={(item) => item.name}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.name}</div>}
                onChange={async (id) => {
                  field.onChange(id)
                  const supplier = await getSupplier(id!).unwrap()
                  const withholdings = await getSupplierWithholdings(id!).unwrap()

                  apply("payment_method", supplier?.payment_method?.id || undefined)
                  apply("currency", supplier?.currency?.id || undefined)
                  apply("withholdings", withholdings?.map((w) => w.id) || [])

                  setCurrency({
                    id: supplier?.currency?.id,
                    name: supplier?.currency?.name
                  })
                }}
                value={field.value}
                getOptionKey={(item) => String(item.id)}
                noResultsMessage="No se encontraron resultados"
                initialOptions={initialSupplier}
              />
              {formState.errors.partner ? (
                <FormMessage />
              ) :
                <FormDescription>
                  Proveedor al que se le registra el pago.
                </FormDescription>
              }
            </FormItem>
          )}
        />
      )}
      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Fecha de pago</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value || null}
                onChange={(date) => field.onChange(date)}
                isDateUnavailable={(date) => date.compare(today(getLocalTimeZone())) > 0}
              />
            </FormControl>
            {formState.errors.date ? (
              <FormMessage />
            ) :
              <FormDescription>
                Fecha en la que se registrará el pago.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="currency"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Moneda</FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string }, number | undefined>
                label="Moneda"
                triggerClassName="!w-full"
                placeholder="Seleccionar moneda..."
                fetcher={handleSearchCurrency}
                getDisplayValue={(item) => item.name}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.name}</div>}
                onChange={(value, item) => {
                  field.onChange(value)
                  setCurrency(item)
                }}
                value={field.value}
                getOptionKey={(item) => String(item.id)}
                noResultsMessage="No se encontraron resultados"
                initialOptions={initialCurrency}
              />
            </FormControl>
            {formState.errors.currency ? (
              <FormMessage />
            ) :
              <FormDescription>
                Moneda que figura en el pago.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      {!billIds && (
        <FormField
          control={control}
          name="amount"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="w-fit">Monto</FormLabel>
              <FormControl>
                <NumberField
                  minValue={0}
                  onChange={field.onChange}
                  value={field.value}
                  formatOptions={
                    currency
                      ? {
                        style: "currency",
                        currency: currency.name,
                        currencyDisplay: "code",
                      }
                      : undefined
                  }
                >
                  <div className="*:not-first:mt-2">
                    <AriaLabel className="sr-only">Monto</AriaLabel>
                    <Group className="border-border outline-none data-[focus-within]:border-ring data-[focus-within]:ring-ring/50 data-[focus-within]:has-aria-invalid:ring-destructive/20 dark:data-[focus-within]:has-aria-invalid:ring-destructive/40 data-[focus-within]:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden rounded-sm border text-sm whitespace-nowrap shadow-sm transition-[color,box-shadow]">
                      <AriaInput
                        placeholder="Monto del pago..."
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
              {formState.errors.amount ? (
                <FormMessage />
              ) :
                <FormDescription>
                  Monto a registrar en el pago.
                </FormDescription>
              }
            </FormItem>
          )}
        />
      )}
      <FormField
        control={control}
        name="withholdings"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="w-fit">Retenciones</FormLabel>
            <FormControl>
              <AsyncMultiSelect<{ id: number, name: string }, number>
                placeholder="Buscar retención…"
                fetcher={fetcher}
                maxCount={1}
                initialOptions={initialTaxes}
                defaultValue={field.value}
                value={field.value}
                getOptionValue={(o) => o.id}
                getOptionKey={(o) => String(o.id)}
                renderOption={(o) => <>{o.name}</>}
                getDisplayValue={(o) => <>{o.name}</>}
                noResultsMessage="No se encontraron resultados"
                onValueChange={(vals) => {
                  field.onChange(vals)
                }}
              />
            </FormControl>
            {formState.errors.withholdings ? (
              <FormMessage />
            ) :
              <FormDescription>
                Impuestos que se retendrán al proveedor.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="payment_method"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Método de pago
            </FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string }, number>
                label="Método de pago"
                triggerClassName="!w-full"
                placeholder="Seleccionar método de pago..."
                fetcher={handleSearchPaymentMethod}
                getDisplayValue={(item) => item.name}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.name}</div>}
                onChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => String(item.id)}
                noResultsMessage="No se encontraron resultados"
                initialOptions={initialPaymentMethod}
              />
            </FormControl>
            {formState.errors.payment_method ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el método de pago que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="payment_reference"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full col-span-2">
            <FormLabel className="w-fit">
              Referencia de pago
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Referencia de pago..."
                className="resize-none"
              />
            </FormControl>
            {formState.errors.payment_reference ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la referencia de pago que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      {billIds && (
        <div className="col-span-2 space-y-1">
          <Label className="text-sm font-medium">Comprobantes</Label>
          <DataTable
            columns={columns}
            data={bills || []}
            loading={isLoadingBills}
            footer={() => <TableFooter />}
            pagination={false}
          />
        </div>
      )}
    </div>
  )
}
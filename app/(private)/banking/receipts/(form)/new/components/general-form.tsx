import { AsyncSelect } from "@/components/async-select"
import { DataTable } from "@/components/data-table"
import DatePicker from "@/components/date-picker"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLazyListCurrenciesQuery } from "@/lib/services/currencies"
import { useLazyListPaymentMethodsQuery } from "@/lib/services/payment-methods"
import { createApply } from "@/lib/utils"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Button as AriaButton, Input as AriaInput, Label as AriaLabel, Group, NumberField } from "react-aria-components"
import { useFormContext, useWatch } from "react-hook-form"
import { z } from "zod"
import { newChargeSchema } from "../../../schemas/receipts"
import { columns } from "./columns"
import TableFooter from "./table-footer"
import { useLazyGetCustomerQuery, useLazyListCustomersQuery } from "@/lib/services/customers"
import { useLazyGetInvoiceQuery } from "@/lib/services/invoices"
import { getLocalTimeZone, today } from "@internationalized/date"

export default function GeneralForm() {
  const params = useSearchParams()

  const { control, formState, setValue, resetField } = useFormContext<z.infer<typeof newChargeSchema>>()

  const [currency, setCurrency] = useState<{ id: number, name: string } | undefined>(undefined)

  const invoiceIds = params.get("bill_ids")

  const [getInvoice, { isLoading: isLoadingInvoices }] = useLazyGetInvoiceQuery()
  const [getCustomer] = useLazyGetCustomerQuery()

  const [searchCurrencies] = useLazyListCurrenciesQuery()
  const [searchPaymentMethods] = useLazyListPaymentMethodsQuery()
  const [searchCustomers] = useLazyListCustomersQuery()

  const handleSearchCurrency = async (query?: string) => {
    try {
      const response = await searchCurrencies({ name: query }).unwrap()
      return response.data?.map(currency => ({
        id: currency.id,
        name: currency.name
      }))
        .slice(0, 10)
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  const handleSearchPaymentMethod = async (query?: string) => {
    try {
      const response = await searchPaymentMethods({
        name: query,
        payment_type: "inbound"
      }).unwrap()
      return response.data?.map(method => ({
        id: method.id,
        name: method.name
      }))
        .slice(0, 10)
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  const handleSearchCustomer = async (query?: string) => {
    try {
      const response = await searchCustomers({ name: query }).unwrap()
      return response.data?.map(customer => ({
        id: customer.id,
        name: customer.name
      }))
        .slice(0, 10)
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  const invoices = useWatch({ control, name: "invoices" })

  useEffect(() => {
    if (invoiceIds) {
      (async () => {
        const ids = invoiceIds.split(",").map((id) => Number(id))
        const invoices = await Promise.all(ids.map((id) => getInvoice(id).unwrap()))

        setValue("invoices", invoices)
      })()
    }
  }, [invoiceIds])

  const apply = useMemo(
    () => createApply<z.infer<typeof newChargeSchema>>(setValue, resetField),
    [setValue, resetField]
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {!invoiceIds && (
        <>
          <FormField
            control={control}
            name="partner"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="w-fit">Cliente</FormLabel>
                <AsyncSelect<{ id: number, name: string }, number | undefined>
                  label="Cliente"
                  triggerClassName="!w-full"
                  placeholder="Seleccionar cliente..."
                  fetcher={handleSearchCustomer}
                  getDisplayValue={(item) => item.name}
                  getOptionValue={(item) => item.id}
                  renderOption={(item) => <div>{item.name}</div>}
                  onChange={async (id) => {
                    field.onChange(id)
                    const supplier = await getCustomer(id!).unwrap()

                    apply("payment_method", supplier?.payment_method?.id || undefined)
                    apply("currency", supplier?.currency?.id || undefined)

                    setCurrency({
                      id: supplier?.currency?.id,
                      name: supplier?.currency?.name
                    })
                  }}
                  value={field.value}
                  getOptionKey={(item) => String(item.id)}
                  noResultsMessage="No se encontraron resultados"
                />
                {formState.errors.partner ? (
                  <FormMessage />
                ) :
                  <FormDescription>
                    Cliente al que se le registra el cobro.
                  </FormDescription>
                }
              </FormItem>
            )}
          />
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
                          placeholder="0.00"
                          className="bg-background text-foreground flex-1 px-3 py-2 tabular-nums outline-none"
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
                    Monto del cobro.
                  </FormDescription>
                }
              </FormItem>
            )}
          />
        </>
      )}
      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Fecha de cobro</FormLabel>
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
                Fecha en la que se registrará el cobro.
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
              Método de cobro
            </FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string }, number>
                label="Método de cobro"
                triggerClassName="!w-full"
                placeholder="Seleccionar método de cobro..."
                fetcher={handleSearchPaymentMethod}
                getDisplayValue={(item) => item.name}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.name}</div>}
                onChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => String(item.id)}
                noResultsMessage="No se encontraron resultados"
              />
            </FormControl>
            {formState.errors.payment_method ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el método de cobro que se registrará.
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
              />
            </FormControl>
            {formState.errors.currency ? (
              <FormMessage />
            ) :
              <FormDescription>
                Moneda que figura en el cobro.
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
              Referencia de cobro
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Referencia de cobro..."
                className="resize-none"
              />
            </FormControl>
            {formState.errors.payment_reference ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la referencia de cobro que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      {invoiceIds && (
        <div className="col-span-2 space-y-1">
          <Label className="text-sm font-medium">Comprobantes</Label>
          <DataTable
            columns={columns}
            data={invoices || []}
            loading={isLoadingInvoices}
            footer={() => <TableFooter />}
            pagination={false}
          />
        </div>
      )}
    </div>
  )
}
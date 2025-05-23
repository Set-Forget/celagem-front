import { AsyncSelect } from "@/components/async-select"
import DatePicker from "@/components/date-picker"
import FormTable from "@/components/form-table"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useLazyGetBillQuery } from "@/lib/services/bills"
import { useLazyListCurrenciesQuery } from "@/lib/services/currencies"
import { useLazyListJournalsQuery } from "@/lib/services/journals"
import { useLazyListPaymentMethodsQuery } from "@/lib/services/payment-methods"
import { useLazyGetSupplierQuery, useLazyListSuppliersQuery } from "@/lib/services/suppliers"
import { cn, createApply } from "@/lib/utils"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Button as AriaButton, Input as AriaInput, Label as AriaLabel, Group, NumberField } from "react-aria-components"
import { useFormContext, useWatch } from "react-hook-form"
import { z } from "zod"
import { newPaymentSchema } from "../../../schemas/payments"
import { columns } from "./columns"
import TableFooter from "./table-footer"
import { DataTable } from "@/components/data-table"
import { AdaptedBillDetail } from "@/lib/adapters/bills"
import { Label } from "@/components/ui/label"

export default function GeneralForm() {
  const params = useSearchParams()

  const { control, formState, setValue, resetField } = useFormContext<z.infer<typeof newPaymentSchema>>()

  const [currency, setCurrency] = useState<{ id: number, name: string } | undefined>(undefined)

  const billIds = params.get("bill_ids")

  const [getBill, { isLoading: isLoadingBills }] = useLazyGetBillQuery()
  const [getSupplier] = useLazyGetSupplierQuery()

  const [searchCurrencies] = useLazyListCurrenciesQuery()
  const [searchPaymentMethods] = useLazyListPaymentMethodsQuery()
  const [searchSuppliers] = useLazyListSuppliersQuery()

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
        payment_type: "outbound"
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

  const handleSearchSupplier = async (query?: string) => {
    try {
      const response = await searchSuppliers({ name: query }).unwrap()
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

  const bills = useWatch({ control, name: "bills" })

  useEffect(() => {
    if (billIds) {
      (async () => {
        const ids = billIds.split(",").map((id) => Number(id))
        const bills = await Promise.all(ids.map((id) => getBill(id).unwrap()))

        setValue("bills", bills)
      })()
    }
  }, [billIds])

  const apply = useMemo(
    () => createApply<z.infer<typeof newPaymentSchema>>(setValue, resetField),
    [setValue, resetField]
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {!billIds && (
        <>
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
                    Proveedor al que se le registra el pago.
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
                    Monto del pago.
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
            <FormLabel className="w-fit">Fecha de pago</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value || null}
                onChange={(date) => field.onChange(date)}
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
                Moneda que figura en el pago.
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
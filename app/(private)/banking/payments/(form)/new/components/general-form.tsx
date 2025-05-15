import { AsyncSelect } from "@/components/async-select"
import DatePicker from "@/components/date-picker"
import FormTable from "@/components/form-table"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useLazyListCurrenciesQuery } from "@/lib/services/currencies"
import { useLazyListJournalsQuery } from "@/lib/services/journals"
import { useLazyListPaymentMethodsQuery } from "@/lib/services/payment-methods"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newPaymentSchema } from "../../../schemas/payments"
import { columns } from "./columns"
import TableFooter from "./table-footer"

export default function GeneralForm() {
  const { control, formState } = useFormContext<z.infer<typeof newPaymentSchema>>()

  const [searchCurrencies] = useLazyListCurrenciesQuery()
  const [searchPaymentMethods] = useLazyListPaymentMethodsQuery()
  const [searchJournals] = useLazyListJournalsQuery()

  const handleSearchCurrency = async (query?: string) => {
    try {
      const response = await searchCurrencies({ name: query }).unwrap()
      return response.data?.map(currency => ({
        id: currency.id,
        name: currency.name
      }))
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  const handleSearchPaymentMethod = async (query?: string) => {
    try {
      const response = await searchPaymentMethods({ name: query }).unwrap()
      return response.data?.map(method => ({
        id: method.id,
        name: method.name
      }))
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  const handleSearchJournal = async (query?: string) => {
    try {
      const response = await searchJournals({ name: query }).unwrap()
      return response.data?.map(journal => ({
        id: journal.id,
        name: journal.name
      }))
    } catch (error) {
      console.error(error)
      return []
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
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
        name="currency"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Moneda</FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string }, number>
                label="Moneda"
                triggerClassName="!w-full"
                placeholder="Seleccionar moneda..."
                fetcher={handleSearchCurrency}
                getDisplayValue={(item) => item.name}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.name}</div>}
                onChange={field.onChange}
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
        name="journal"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Diario contable</FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string }, number>
                label="Diario contable"
                triggerClassName="!w-full"
                placeholder="Seleccionar diario contable..."
                fetcher={handleSearchJournal}
                getDisplayValue={(item) => item.name}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.name}</div>}
                onChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => String(item.id)}
                noResultsMessage="No se encontraron resultados"
              />
            </FormControl>
            {formState.errors.journal ? (
              <FormMessage />
            ) :
              <FormDescription>
                Diario contable al que pertenece el pago.
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
      <FormField
        control={control}
        name="invoices"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full col-span-2">
            <FormLabel className="w-fit">Facturas</FormLabel>
            <FormControl>
              <FormTable<z.infer<typeof newPaymentSchema>>
                columns={columns}
                footer={({ append }) => <TableFooter append={append} />}
                name="invoices"
                className="col-span-2"
              />
            </FormControl>
            {formState.errors.invoices?.message && (
              <p className="text-destructive text-[12.8px] mt-1 font-medium">
                {formState.errors.invoices.message}
              </p>
            )}
          </FormItem>
        )}
      />
    </div>
  )
}
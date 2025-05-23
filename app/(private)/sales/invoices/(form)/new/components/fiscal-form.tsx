import { AsyncSelect } from "@/components/async-select"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useLazyListCurrenciesQuery } from "@/lib/services/currencies"
import { useLazyListPaymentTermsQuery } from "@/lib/services/payment-terms"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { useLazyListPaymentMethodsQuery } from "@/lib/services/payment-methods"
import { newInvoiceSchema } from "../../../schemas/invoices"

export default function FiscalForm() {
  const { control, formState } = useFormContext<z.infer<typeof newInvoiceSchema>>()

  const [searchCurrencies] = useLazyListCurrenciesQuery()
  const [searchPaymentTerms] = useLazyListPaymentTermsQuery()
  const [searchPaymentMethods] = useLazyListPaymentMethodsQuery()

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

  const handleSearchPaymentTerm = async (query?: string) => {
    try {
      const response = await searchPaymentTerms({ name: query }).unwrap()
      return response.data?.map(term => ({
        id: term.id,
        name: term.name
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

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="payment_term"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Condición de pago
            </FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string }, number>
                label="Condición de pago"
                triggerClassName="!w-full"
                placeholder="Seleccionar condición de pago..."
                fetcher={handleSearchPaymentTerm}
                getDisplayValue={(item) => item.name}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.name}</div>}
                onChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => String(item.id)}
                noResultsMessage="No se encontraron resultados"
              />
            </FormControl>
            {formState.errors.payment_term ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la condición de pago de la factura de compra.
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
                Este será el método de pago de la factura de compra.
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
                Esta será la moneda de la factura de compra.
              </FormDescription>
            }
          </FormItem>
        )}
      />
    </div>
  )
}
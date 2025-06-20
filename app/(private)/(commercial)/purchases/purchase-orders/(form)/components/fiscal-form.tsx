import { useCurrencySelect } from "@/hooks/use-currency-select"
import { usePaymentTermSelect } from "@/hooks/use-payment-term-select"
import { AsyncSelect } from "@/components/async-select"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newPurchaseOrderSchema } from "../../schemas/purchase-orders"

export default function FiscalForm() {
  const { control, formState } = useFormContext<z.infer<typeof newPurchaseOrderSchema>>()

  const { initialOptions: initialPaymentTerm, fetcher: handleSearchPaymentTerm } = usePaymentTermSelect({
    paymentTermId: control._getWatch("payment_term"),
  })
  const { initialOptions: initialCurrency, fetcher: handleSearchCurrency } = useCurrencySelect({
    currencyId: control._getWatch("currency"),
  })

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
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
                initialOptions={initialCurrency}
              />
            </FormControl>
            {formState.errors.currency ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la moneda de la orden de compra.
              </FormDescription>
            }
          </FormItem>
        )}
      />
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
                initialOptions={initialPaymentTerm}
              />
            </FormControl>
            {formState.errors.payment_term ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la condición de pago de la orden de compra.
              </FormDescription>
            }
          </FormItem>
        )}
      />
    </div>
  )
}
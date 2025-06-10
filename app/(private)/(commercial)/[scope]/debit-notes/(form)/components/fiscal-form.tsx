import { useCurrencySelect } from "@/hooks/use-currency-select"
import { usePaymentMethodSelect } from "@/hooks/use-payment-method-select"
import { usePaymentTermSelect } from "@/hooks/use-payment-term-select"
import { AsyncSelect } from "@/components/async-select"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newDebitNoteSchema } from "../../schemas/debit-notes"

export default function FiscalForm() {
  const { scope } = useParams<{ scope: "sales" | "purchases" }>()

  const { control, formState } = useFormContext<z.infer<typeof newDebitNoteSchema>>()

  const { initialOptions: initialCurrency, fetcher: handleSearchCurrency } = useCurrencySelect({
    currencyId: control._getWatch("currency"),
  })
  const { initialOptions: initialPaymentMethod, fetcher: handleSearchPaymentMethod } = usePaymentMethodSelect({
    paymentMethodId: control._getWatch("payment_method"),
    paymentType: scope === "purchases" ? "outbound" : "inbound"
  })
  const { initialOptions: initialPaymentTerm, fetcher: handleSearchPaymentTerm } = usePaymentTermSelect({
    paymentTermId: control._getWatch("payment_term"),
  })

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
                initialOptions={initialPaymentTerm}
              />
            </FormControl>
            {formState.errors.payment_term ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la condición de pago de la nota de débito.
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
                Este será el método de pago de la nota de débito.
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
                initialOptions={initialCurrency}
              />
            </FormControl>
            {formState.errors.currency ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la moneda de la nota de débito.
              </FormDescription>
            }
          </FormItem>
        )}
      />
    </div>
  )
}
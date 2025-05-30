import { useAccountingAccountSelect } from "@/app/(private)/(commercial)/hooks/use-account-select"
import { useCurrencySelect } from "@/app/(private)/(commercial)/hooks/use-currency-select"
import { usePaymentMethodSelect } from "@/app/(private)/(commercial)/hooks/use-payment-method-select"
import { usePaymentTermSelect } from "@/app/(private)/(commercial)/hooks/use-payment-term-select"
import { AsyncSelect } from "@/components/async-select"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newCustomerSchema } from "../../../schema/customers"

export default function AccountingForm() {
  const { control, formState } = useFormContext<z.infer<typeof newCustomerSchema>>()

  const { initialOptions: initialPaymentMethod, fetcher: handleSearchPaymentMethod } = usePaymentMethodSelect({
    paymentMethodId: control._getWatch("payment_method"),
    paymentType: "inbound"
  })
  const { initialOptions: initialPaymentTerm, fetcher: handleSearchPaymentTerm } = usePaymentTermSelect({
    paymentTermId: control._getWatch("payment_term"),
  })
  const { initialOptions: initialCurrency, fetcher: handleSearchCurrency } = useCurrencySelect({
    currencyId: control._getWatch("currency"),
  })
  const { initialOptions: initialAccountingAccount, fetcher: handleSearchAccountingAccount } = useAccountingAccountSelect({
    accountId: control._getWatch("account"),
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
                Esta será la moneda del cliente que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="property_payment_term"
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
            {formState.errors.property_payment_term ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la condición de pago del cliente que se registrará.
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
            <FormLabel className="w-fit">Metodo de pago</FormLabel>
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
            {formState.errors.payment_method ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el método de pago del cliente que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="account"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Cuenta contable</FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string, code: string }, number>
                label="Cuenta contable"
                triggerClassName="!w-full"
                placeholder="Seleccionar cuenta contable..."
                fetcher={handleSearchAccountingAccount}
                getDisplayValue={(item) => `${item.code} - ${item.name}`}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.code} - {item.name}</div>}
                onChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => String(item.id)}
                noResultsMessage="No se encontraron resultados"
                initialOptions={initialAccountingAccount}
              />
            </FormControl>
            {formState.errors.account ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la cuenta contable del cliente que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
    </div>
  )
}
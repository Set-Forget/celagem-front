import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newPaymentSchema } from "../../../schemas/payments"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import SearchSelect from "@/components/search-select"
import { payment_methods } from "@/app/(private)/purchases/vendors/(form)/new/data"
import DatePicker from "@/components/date-picker"
import { Textarea } from "@/components/ui/textarea"
import { useLazyListCurrenciesQuery } from "@/lib/services/currencies"
import { AsyncSelect } from "@/components/async-select"
import TableFooter from "./table-footer"
import { columns } from "./columns"
import FormTable from "@/components/form-table"

const journals = [
  { value: 1, label: "Banco BBVA - Cuenta Corriente" },
  { value: 2, label: "Banco Nación - Cuenta Corriente" },
  { value: 3, label: "Caja Central" },
  { value: 4, label: "Ventas - Facturas de Clientes" },
  { value: 5, label: "Compras - Facturas de Proveedores" },
  { value: 6, label: "Ajustes Contables" },
  { value: 7, label: "Caja Sucursal 1" },
  { value: 8, label: "Banco Santander - Cuenta USD" },
  { value: 9, label: "Mercado Pago" },
  { value: 10, label: "Banco Galicia - Cuenta Corriente" },
];

export default function GeneralForm() {
  const { control, formState } = useFormContext<z.infer<typeof newPaymentSchema>>()

  const [searchCurrencies] = useLazyListCurrenciesQuery()

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

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField // ! Debería venir de un endpoint.
        control={control}
        name="payment_method"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Metodo de pago</FormLabel>
            <SearchSelect
              value={field.value}
              onSelect={field.onChange}
              options={payment_methods}
              placeholder="Seleccionar metodo de pago..."
              searchPlaceholder="Buscar..."
            />
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
            <FormLabel className="w-fit">
              Diario contable
            </FormLabel>
            <FormControl>
              <SearchSelect
                value={field.value}
                onSelect={field.onChange}
                options={journals}
                placeholder="Seleccionar diario contable..."
                searchPlaceholder="Buscar..."
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
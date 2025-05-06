import { AsyncSelect } from "@/components/async-select"
import FormTable from "@/components/form-table"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLazyListSuppliersQuery } from "@/lib/services/suppliers"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newBillSchema } from "../../schemas/bills"
import { columns } from "./columns"
import TableFooter from "./table-footer"
import { Textarea } from "@/components/ui/textarea"
import { useLazyListCurrenciesQuery } from "@/lib/services/currencies"
import { useLazyListPaymentTermsQuery } from "@/lib/services/payment-terms"

export default function GeneralForm() {
  const { control, formState } = useFormContext<z.infer<typeof newBillSchema>>()

  const [searchSuppliers] = useLazyListSuppliersQuery()
  const [searchCurrencies] = useLazyListCurrenciesQuery()
  const [searchPaymentTerms] = useLazyListPaymentTermsQuery()

  const handleSearchSupplier = async (query?: string) => {
    try {
      const response = await searchSuppliers({ name: query }).unwrap()
      return response.data?.map(supplier => ({
        id: supplier.id,
        name: supplier.name
      }))
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

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

  const handleSearchPaymentTerm = async (query?: string) => {
    try {
      const response = await searchPaymentTerms({ name: query }).unwrap()
      return response.data?.map(term => ({
        id: term.id,
        name: term.name
      }))
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
        name="supplier"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Proveedor</FormLabel>
            <AsyncSelect<{ id: number, name: string }, number>
              label="Proveedor"
              triggerClassName="!w-full"
              placeholder="Seleccionar proveedor..."
              fetcher={handleSearchSupplier}
              getDisplayValue={(item) => item.name}
              getOptionValue={(item) => item.id}
              renderOption={(item) => <div>{item.name}</div>}
              onChange={field.onChange}
              value={field.value}
              getOptionKey={(item) => String(item.id)}
              noResultsMessage="No se encontraron resultados"
            />
            {formState.errors.supplier ? (
              <FormMessage />
            ) :
              <FormDescription>
                Proveedor que figura en la factura.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="number"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Número de factura</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Número de factura"
              />
            </FormControl>
            {formState.errors.number ? (
              <FormMessage />
            ) :
              <FormDescription>
                Número de factura que figura en el documento.
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
              />
            </FormControl>
            {formState.errors.payment_term ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la condición de pago de la factura.
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
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Método de pago" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">
                    Efectivo
                  </SelectItem>
                  <SelectItem value="1">
                    Transferencia
                  </SelectItem>
                  <SelectItem value="2">
                    Cheque
                  </SelectItem>
                  <SelectItem value="3">
                    Tarjeta de crédito
                  </SelectItem>
                  <SelectItem value="4">
                    Tarjeta de débito
                  </SelectItem>
                </SelectContent>
              </Select>
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
                Moneda que figura en la factura de compra.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="items"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full col-span-2">
            <FormLabel className="w-fit">Items</FormLabel>
            <FormControl>
              <FormTable<z.infer<typeof newBillSchema>>
                columns={columns}
                footer={({ append }) => <TableFooter append={append} />}
                name="items"
                className="col-span-2"
              />
            </FormControl>
            {formState.errors.items?.message && (
              <p className="text-destructive text-[12.8px] mt-1 font-medium">
                {formState.errors.items.message}
              </p>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="tyc_notes"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full col-span-2">
            <FormLabel className="w-fit">Terminos y condiciones</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Términos y condiciones..."
              />
            </FormControl>
            {formState.errors.tyc_notes ? (
              <FormMessage />
            ) :
              <FormDescription>
                Estos términos y condiciones se incluirán en la orden de compra.
              </FormDescription>
            }
          </FormItem>
        )}
      />
    </div>
  )
}
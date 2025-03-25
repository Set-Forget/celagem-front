import { AsyncSelect } from "@/components/async-select"
import FormTable from "@/components/form-table"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLazyListSuppliersQuery } from "@/lib/services/suppliers"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newBillSchema } from "../../../schemas/bills"
import { columns } from "./columns"
import TableFooter from "./table-footer"
import { Textarea } from "@/components/ui/textarea"

// ! Debe traerse de la API
const currencies = [
  { label: "ARS (Peso argentino)", value: "ARS", id: 1 },
  { label: "COP (Peso colombiano)", value: "COP", id: 2 },
  { label: "USD (Dólar estadounidense)", value: "USD", id: 3 },
] as const;

export default function GeneralForm() {
  const { control, formState } = useFormContext<z.infer<typeof newBillSchema>>()

  const [searchSuppliers] = useLazyListSuppliersQuery()

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
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Condición de pago" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">
                    Anticipo
                  </SelectItem>
                  <SelectItem value="1">
                    7 días
                  </SelectItem>
                  <SelectItem value="2">
                    15 días
                  </SelectItem>
                  <SelectItem value="3">
                    30 días
                  </SelectItem>
                  <SelectItem value="4">
                    60 días
                  </SelectItem>
                  <SelectItem value="5">
                    90 días
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {formState.errors.payment_term ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el tipo de pago que se registrará.
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
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Moneda" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem
                      key={currency.id}
                      value={String(currency.id)}
                    >
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
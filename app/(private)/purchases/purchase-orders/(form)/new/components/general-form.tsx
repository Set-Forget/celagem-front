import { AsyncSelect } from "@/components/async-select"
import DatePicker from "@/components/date-picker"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLazyListSuppliersQuery } from "@/lib/services/suppliers"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newPurchaseOrderSchema } from "../../../schemas/purchase-orders"
import TableFooter from "./table-footer"
import { columns } from "./columns"
import FormTable from "@/components/form-table"
import { Textarea } from "@/components/ui/textarea"
import { useLazyListPurchaseRequestsQuery } from "@/lib/services/purchase-requests"

const currencies = [
  { label: "ARS (Peso argentino)", value: "ARS", id: 1 },
  { label: "COP (Peso colombiano)", value: "COP", id: 2 },
  { label: "USD (Dólar estadounidense)", value: "USD", id: 3 },
] as const;

export default function GeneralForm() {
  const { control, formState } = useFormContext<z.infer<typeof newPurchaseOrderSchema>>()

  const [searchSuppliers] = useLazyListSuppliersQuery()
  const [searchPurchaseRequest] = useLazyListPurchaseRequestsQuery()

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

  const handleSearchPurchaseRequest = async (query?: string) => {
    try {
      const response = await searchPurchaseRequest({ name: query }).unwrap()
      return response.data?.map(purchase_request => ({
        id: purchase_request.id,
        name: purchase_request.name
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
            <FormControl>
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
            </FormControl>
            {formState.errors.supplier ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será el proveedor al que se le emitirá la orden de compra.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="required_date"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Fecha de requerimiento</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value || null}
                onChange={(date) => field.onChange(date)}
              />
            </FormControl>
            {formState.errors.required_date ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la fecha en la que se requiere la entrega de los productos.
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
                  <SelectItem value="anticipo">
                    Anticipo
                  </SelectItem>
                  <SelectItem value="7_dias">
                    7 días
                  </SelectItem>
                  <SelectItem value="15_dias">
                    15 días
                  </SelectItem>
                  <SelectItem value="30_dias">
                    30 días
                  </SelectItem>
                  <SelectItem value="60_dias">
                    60 días
                  </SelectItem>
                  <SelectItem value="90_dias">
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
        name="purchase_request"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Solicitud de pedido</FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string }, number>
                label="Solicitud de pedido"
                triggerClassName="!w-full"
                placeholder="Seleccionar solicitud de pedido..."
                fetcher={handleSearchPurchaseRequest}
                getDisplayValue={(item) => item.name}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.name}</div>}
                onChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => String(item.id)}
                noResultsMessage="No se encontraron resultados"
              />
            </FormControl>
            {formState.errors.purchase_request ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la solicitud de pedido a la que se le emitirá la orden de compra.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full md:col-span-2">
            <FormLabel className="w-fit">Notas</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Notas internas..."
                className="resize-none"
              />
            </FormControl>
            <FormDescription>
              Estas notas son internas y no se incluirán en la orden de compra.
            </FormDescription>
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
              <FormTable<z.infer<typeof newPurchaseOrderSchema>>
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
          <FormItem className="flex flex-col w-full md:col-span-2">
            <FormLabel className="w-fit">Terminos y condiciones</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Terminos y condiciones..."
                className="resize-none"
              />
            </FormControl>
            <FormDescription>
              Estos términos y condiciones se incluirán en la orden de compra.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  )
}
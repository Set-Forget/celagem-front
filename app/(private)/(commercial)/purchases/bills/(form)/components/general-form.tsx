import { AsyncSelect } from "@/components/async-select"
import DatePicker from "@/components/date-picker"
import FormTable from "@/components/form-table"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useLazyGetSupplierQuery, useLazyListSuppliersQuery } from "@/lib/services/suppliers"
import { createApply } from "@/lib/utils"
import { getLocalTimeZone, today } from "@internationalized/date"
import { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newBillSchema } from "../../schemas/bills"
import { columns } from "./columns"
import TableFooter from "./table-footer"

export default function GeneralForm() {
  const { control, formState, setValue, resetField } = useFormContext<z.infer<typeof newBillSchema>>()

  const [searchSuppliers] = useLazyListSuppliersQuery()
  const [getSupplier] = useLazyGetSupplierQuery()

  const handleSearchSupplier = async (query?: string) => {
    try {
      const response = await searchSuppliers({ name: query }).unwrap()
      return response.data?.map(supplier => ({
        id: supplier.id,
        name: supplier.name
      }))
        .slice(0, 10)
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  const apply = useMemo(
    () => createApply<z.infer<typeof newBillSchema>>(setValue, resetField),
    [setValue, resetField]
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
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
                Número de factura que figura en la factura de compra.
              </FormDescription>
            }
          </FormItem>
        )}
      />
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
              onChange={async (id) => {
                field.onChange(id)
                const supplier = await getSupplier(id).unwrap()

                apply("payment_method", supplier?.payment_method?.id || undefined)
                apply("currency", supplier?.currency.id)
                apply("payment_term", supplier?.property_payment_term?.id)
              }}
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
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Fecha de factura</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value || null}
                onChange={(date) => field.onChange(date)}
                isDateUnavailable={(date) => date.compare(today(getLocalTimeZone())) > 0}
              />
            </FormControl>
            {formState.errors.date ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la fecha en la que se emitió la factura.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="accounting_date"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Fecha de contabilización</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value || null}
                onChange={(date) => field.onChange(date)}
                isDateUnavailable={(date) => date.compare(today(getLocalTimeZone())) > 0}
              />
            </FormControl>
            {formState.errors.accounting_date ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la fecha en la que se contabilizará la factura.
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
    </div>
  )
}
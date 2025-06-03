import { FormTableFooter } from "@/app/(private)/(commercial)/components/form-table-footer"
import { useSupplierSelect } from "@/app/(private)/(commercial)/hooks/use-supplier-select"
import { AsyncSelect } from "@/components/async-select"
import DatePicker from "@/components/date-picker"
import FormTable from "@/components/form-table"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useLazyGetSupplierQuery } from "@/lib/services/suppliers"
import { createApply } from "@/lib/utils"
import { getLocalTimeZone, today } from "@internationalized/date"
import { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"
import { NewBill, NewBillLine, newBillSchema } from "../../schemas/bills"
import { columns } from "./columns"

export default function GeneralForm() {
  const { control, formState, setValue, resetField } = useFormContext<z.infer<typeof newBillSchema>>()

  const [getSupplier] = useLazyGetSupplierQuery()

  const { fetcher: handleSearchSupplier } = useSupplierSelect()

  const apply = useMemo(
    () => createApply<z.infer<typeof newBillSchema>>(setValue, resetField),
    [setValue, resetField]
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="custom_sequence_number"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Número de factura</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Número de factura"
              />
            </FormControl>
            {formState.errors.custom_sequence_number ? (
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
                name="items"
                className="col-span-2"
                columns={columns}
                footer={({ append }) =>
                  <FormTableFooter<NewBill, NewBillLine>
                    control={control}
                    onAddRow={() => append({
                      id: uuidv4(),
                      product_id: null,
                      quantity: 1,
                      price_unit: 0,
                      account_id: null,
                      cost_center: null,
                      taxes_id: []
                    })}
                    colSpan={columns.length}
                    selectors={{
                      items: (values) => values.items,
                      currencyId: (values) => values.currency,
                      unitPrice: (item) => item.price_unit,
                      quantity: (item) => item.quantity,
                      taxes: (item) => item.taxes_id || [],
                    }}
                  />
                }
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
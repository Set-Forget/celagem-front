import { useCustomerSelect } from "@/app/(private)/(commercial)/hooks/use-customer-select"
import { AsyncSelect } from "@/components/async-select"
import DatePicker from "@/components/date-picker"
import FormTable from "@/components/form-table"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useLazyGetCustomerQuery } from "@/lib/services/customers"
import { createApply } from "@/lib/utils"
import { getLocalTimeZone, today } from "@internationalized/date"
import { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newInvoiceSchema } from "../../../schemas/invoices"
import { columns } from "./columns"
import TableFooter from "./table-footer"

export default function GeneralForm() {
  const { control, formState, setValue, resetField } = useFormContext<z.infer<typeof newInvoiceSchema>>()

  const [getCustomer] = useLazyGetCustomerQuery()

  const { initialOptions: initialCustomer, fetcher: handleSearchCustomer } = useCustomerSelect({
    customerId: control._getWatch("partner"),
  })

  const apply = useMemo(
    () => createApply<z.infer<typeof newInvoiceSchema>>(setValue, resetField),
    [setValue, resetField]
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="customer"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Cliente</FormLabel>
            <AsyncSelect<{ id: number, name: string }, number>
              label="Cliente"
              triggerClassName="!w-full"
              placeholder="Seleccionar cliente..."
              fetcher={handleSearchCustomer}
              getDisplayValue={(item) => item.name}
              getOptionValue={(item) => item.id}
              renderOption={(item) => <div>{item.name}</div>}
              onChange={async (id) => {
                field.onChange(id)
                const customer = await getCustomer(id).unwrap()

                apply("currency", customer?.currency?.id)
                apply("payment_method", customer?.payment_method?.id)
                apply("payment_term", customer?.property_payment_term?.id)
              }}
              value={field.value}
              getOptionKey={(item) => String(item.id)}
              noResultsMessage="No se encontraron resultados"
              initialOptions={initialCustomer}
            />
            {formState.errors.customer ? (
              <FormMessage />
            ) :
              <FormDescription>
                Cliente al que se le factura.
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
              <FormTable<z.infer<typeof newInvoiceSchema>>
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
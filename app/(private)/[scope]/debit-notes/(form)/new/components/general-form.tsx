import DatePicker from "@/components/date-picker"
import FormTable from "@/components/form-table"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useGetBillQuery } from "@/lib/services/bills"
import { useGetInvoiceQuery } from "@/lib/services/invoices"
import { getLocalTimeZone, today } from "@internationalized/date"
import { useParams, useSearchParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newDebitNoteSchema } from "../../../schemas/debit-notes"
import { columns } from "./columns"
import TableFooter from "./table-footer"

export default function GeneralForm() {
  const { scope } = useParams<{ scope: "sales" | "purchases" }>()

  const params = useSearchParams()

  const invoiceId = params.get("invoiceId");
  const billId = params.get("billId");

  const { control, formState } = useFormContext<z.infer<typeof newDebitNoteSchema>>()

  const { isLoading: isInvoiceLoading } = useGetInvoiceQuery(invoiceId ?? "", {
    skip: !invoiceId
  });
  const { isLoading: isBillLoading } = useGetBillQuery(billId ?? "", {
    skip: !billId
  });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {scope === "purchases" && (
        <>
          <FormField
            control={control}
            name="number"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="w-fit">
                  Número de nota de débito
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Número de nota de débito"
                  />
                </FormControl>
                {formState.errors.number ? (
                  <FormMessage />
                ) :
                  <FormDescription>
                    Número de nota de débito a crear.
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
                <FormLabel className="w-fit">Fecha de emisión</FormLabel>
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
                    Esta será la fecha de emisión de la nota de débito.
                  </FormDescription>
                }
              </FormItem>
            )}
          />
        </>
      )}
      <FormField
        control={control}
        name="accounting_date"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Fecha de contabilidad</FormLabel>
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
                Esta será la fecha en la que se contabilizará la nota de débito.
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
              <FormTable<z.infer<typeof newDebitNoteSchema>>
                columns={columns}
                footer={({ append }) => <TableFooter append={append} />}
                name="items"
                loading={isInvoiceLoading || isBillLoading}
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
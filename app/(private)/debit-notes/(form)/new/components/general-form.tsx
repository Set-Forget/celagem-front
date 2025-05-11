import DatePicker from "@/components/date-picker"
import FormTable from "@/components/form-table"
import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useGetBillQuery } from "@/lib/services/bills"
import { useGetInvoiceQuery } from "@/lib/services/invoices"
import { cn, placeholder } from "@/lib/utils"
import { Eye } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Separator } from "react-aria-components"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newDebitNoteSchema } from "../../../schemas/debit-notes"
import { columns } from "./columns"
import TableFooter from "./table-footer"
import { Input } from "@/components/ui/input"

export default function GeneralForm() {
  const router = useRouter()
  const params = useSearchParams()

  const invoiceId = params.get("invoiceId");
  const billId = params.get("billId");

  const { control, formState } = useFormContext<z.infer<typeof newDebitNoteSchema>>()

  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(invoiceId ?? "", {
    skip: !invoiceId
  });

  const { data: bill, isLoading: isBillLoading } = useGetBillQuery(billId ?? "", {
    skip: !billId
  });

  const { id: partyId, name: partyName } = (invoice?.customer || bill?.supplier) || {}

  const document = invoice || bill
  const isDocumentLoading = isInvoiceLoading || isBillLoading
  const moveType = billId ? "in_invoice" : "out_invoice"

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Factura</label>
          <div className="flex gap-2 items-center group w-fit">
            <span className={cn("text-sm font-medium tracking-tight transition-all duration-300", isDocumentLoading ? "blur-[4px]" : "blur-none")}>
              {isDocumentLoading ? placeholder(20, true) : document?.number}
            </span>
            <Button
              variant="outline"
              size="icon"
              className={cn("w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity", isDocumentLoading && "hidden")}
              onClick={() => router.push(`/purchases/bills/${document?.id}`)}
            >
              <Eye />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Contacto</label>
          <div className="flex gap-2 items-center group w-fit">
            <span className={cn("text-sm font-medium tracking-tight transition-all duration-300", isDocumentLoading ? "blur-[4px]" : "blur-none")}>
              {isDocumentLoading ? placeholder(20, true) : partyName}
            </span>
            <Button
              variant="outline"
              size="icon"
              className={cn("w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity", isDocumentLoading && "hidden")}
              onClick={() => router.push(`/purchases/vendors/${partyId}`)}
            >
              <Eye />
            </Button>
          </div>
        </div>
      </div>
      <Separator className="col-span-full" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        {moveType === "in_invoice" && (
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
                  loading={isInvoiceLoading}
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
    </>
  )
}
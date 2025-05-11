import FormTable from "@/components/form-table"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { useGetBillQuery } from "@/lib/services/bills"
import { useGetInvoiceQuery } from "@/lib/services/invoices"
import { cn, placeholder } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Eye } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newCreditNoteSchema } from "../../../schemas/credit-notes"
import { columns } from "./columns"
import TableFooter from "./table-footer"

export default function GeneralForm() {
  const router = useRouter()
  const params = useSearchParams()

  const invoiceId = params.get("invoiceId");
  const billId = params.get("billId");

  const { control, formState, setValue } = useFormContext<z.infer<typeof newCreditNoteSchema>>()

  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(invoiceId ?? "", {
    skip: !invoiceId
  });

  const { data: bill, isLoading: isBillLoading } = useGetBillQuery(billId ?? "", {
    skip: !billId
  });

  const { id: partyId, name: partyName } = (invoice?.customer || bill?.supplier) || {}

  const document = invoice || bill
  const isDocumentLoading = isInvoiceLoading || isBillLoading
  const moveType = billId ? "in_refund" : "out_refund"

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
        {moveType === "in_refund" && (
          <FormField
            control={control}
            name="number"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="w-fit">
                  Número de nota de crédito
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Número de nota de crédito"
                  />
                </FormControl>
                {formState.errors.number ? (
                  <FormMessage />
                ) :
                  <FormDescription>
                    Número de la nota de crédito a crear.
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
              <FormLabel className="w-fit">Fecha de contabilización</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PP")
                      ) : (
                        <span>Seleccioná una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (!date) return
                      setValue("accounting_date", date?.toISOString(), { shouldValidate: true })
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formState.errors.accounting_date ? (
                <FormMessage />
              ) :
                <FormDescription>
                  Esta es la fecha que se usará para contabilizar la nota de crédito.
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
                <FormTable<z.infer<typeof newCreditNoteSchema>>
                  columns={columns}
                  footer={({ append }) => <TableFooter append={append} />}
                  name="items"
                  loading={isDocumentLoading}
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
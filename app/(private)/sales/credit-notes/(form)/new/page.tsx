"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import CustomSonner from "@/components/custom-sonner"
import DataTabs from "@/components/data-tabs"
import FormTable from "@/components/form-table"
import Header from "@/components/header"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useCreateCreditNoteMutation } from "@/lib/services/credit-notes"
import { useGetInvoiceQuery } from "@/lib/services/invoices"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Box, CalendarIcon, Receipt, Save } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { newCreditNoteSchema } from "../../schemas/credit-notes"
import { columns } from "./components/columns"
import CustomerTab from "./components/customer-tab"
import InvoiceTab from "./components/invoice-tab"
import TableFooter from "./components/table-footer"

const tabs = [
  {
    value: "tab-1",
    label: "Factura",
    icon: <Receipt className="mr-1.5" size={16} />,
    content: <InvoiceTab />
  },
  {
    value: "tab-2",
    label: "Cliente",
    icon: <Box className="mr-1.5" size={16} />,
    content: <CustomerTab />
  }
]

export default function Page() {
  const router = useRouter()
  const params = useSearchParams()

  const invoiceId = params.get("invoiceId");

  const [tab, setTab] = useState(tabs[0].value)

  const [createCreditNote, { isLoading: isCreatingCreditNote }] = useCreateCreditNoteMutation()
  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(invoiceId ?? "", {
    skip: !invoiceId
  });

  const newCreditNoteForm = useForm<z.infer<typeof newCreditNoteSchema>>({
    resolver: zodResolver(newCreditNoteSchema),
  })

  const onSubmit = async (data: z.infer<typeof newCreditNoteSchema>) => {
    try {
      const response = await createCreditNote({
        ...data,
        number: `ND-${Math.floor(Math.random() * 100000)}`,
        items: data.items.map((item) => ({
          quantity: item.quantity,
          product_id: item.product_id,
          taxes_id: item?.taxes_id,
          // price_unit: item.price_unit, // ! No se envía el precio unitario porque aún no existe en el backend.
        })),
      }).unwrap()

      if (response.status === "success") {
        router.push(`/sales/credit-notes/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Nota de crédito creada exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la nota de crédito" variant="error" />)
    }
  }

  useEffect(() => {
    if (invoice) {
      newCreditNoteForm.reset({
        partner: invoice.customer.id,
        number: invoice.number || "", // ! Deberia auto-generarse y ser opcional.
        currency: invoice.currency.id,
        move_type: "out_refund",
        associated_invoice: invoice.id,
        date: new Date().toISOString(),
        items: invoice.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          taxes_id: item.taxes.map((tax) => tax.id),
          unit_price: item.price_unit
        }))
      })
    }
  }, [invoice])

  return (
    <Form {...newCreditNoteForm}>
      <Header title="Nueva nota de crédito">
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newCreditNoteForm.handleSubmit(onSubmit)}
            size="sm"
            loading={isCreatingCreditNote}
          >
            <Save className={cn(isCreatingCreditNote && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <FormField
          control={newCreditNoteForm.control}
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
                        format(field.value, "PPP")
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
                      newCreditNoteForm.setValue("accounting_date", date?.toISOString(), { shouldValidate: true })
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {newCreditNoteForm.formState.errors.accounting_date ? (
                <FormMessage />
              ) :
                <FormDescription>
                  Fecha en la que se registrará la factura en la contabilización.
                </FormDescription>
              }
            </FormItem>
          )}
        />
        <FormField
          control={newCreditNoteForm.control}
          name="items"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full col-span-2">
              <FormLabel className="w-fit">Items</FormLabel>
              <FormControl>
                <FormTable<z.infer<typeof newCreditNoteSchema>>
                  columns={columns}
                  footer={({ append }) => <TableFooter append={append} />}
                  name="items"
                  loading={isInvoiceLoading}
                  className="col-span-2"
                />
              </FormControl>
              {newCreditNoteForm.formState.errors.items?.message && (
                <p className="text-destructive text-[12.8px] mt-1 font-medium">
                  {newCreditNoteForm.formState.errors.items.message}
                </p>
              )}
            </FormItem>
          )}
        />
      </div>
      <DataTabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        triggerClassName="mt-4"
      />
    </Form>
  )
}
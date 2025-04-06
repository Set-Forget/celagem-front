"use client"


import { AsyncSelect } from "@/components/async-select"
import CustomSonner from "@/components/custom-sonner"
import DataTabs from "@/components/data-tabs"
import FormTable from "@/components/form-table"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateDebitNoteMutation } from "@/lib/services/debit-notes"
import { useGetInvoiceQuery } from "@/lib/services/invoices"
import { useLazyListPaymentTermsQuery } from "@/lib/services/payment-terms"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Box, CalendarIcon, Receipt, Save } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newDebitNoteSchema } from "../../schemas/debit-notes"
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

  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(invoiceId ?? "", {
    skip: !invoiceId
  });
  const [createDebitNote, { isLoading: isCreatingDebitNote }] = useCreateDebitNoteMutation()
  const [searchPaymentTerms] = useLazyListPaymentTermsQuery()

  const newDebitNoteForm = useForm<z.infer<typeof newDebitNoteSchema>>({
    resolver: zodResolver(newDebitNoteSchema),
  })

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

  const onSubmit = async (data: z.infer<typeof newDebitNoteSchema>) => {
    try {
      const response = await createDebitNote({
        ...data,
        number: `ND-${Math.floor(Math.random() * 100000)}`,
        payment_method: 1,
        items: data.items.map((item) => ({
          quantity: item.quantity,
          product_id: item.product_id,
          taxes_id: item?.taxes_id,
          // price_unit: item.price_unit, // ! No se envía el precio unitario porque aún no existe en el backend.
        })),
      }).unwrap()

      if (response.status === "success") {
        router.push(`/sales/debit-notes/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Nota de débito creada con éxito" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la nota de débito" variant="error" />)
    }
  }

  useEffect(() => {
    if (invoice) {
      newDebitNoteForm.reset({
        partner: invoice.customer.id,
        number: invoice.number || "", // ! Deberia auto-generarse y ser opcional.
        currency: invoice.currency.id,
        move_type: "out_invoice",
        associated_invoice: invoice.id,
        payment_term: invoice.payment_term.id,
        date: new Date().toISOString(),
        items: []
      })
    }
  }, [invoice])

  return (
    <Form {...newDebitNoteForm}>
      <Header title="Nueva nota de débito">
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newDebitNoteForm.handleSubmit(onSubmit)}
            size="sm"
            loading={isCreatingDebitNote}
          >
            <Save className={cn(isCreatingDebitNote && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <FormField
          control={newDebitNoteForm.control}
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
                      newDebitNoteForm.setValue("accounting_date", date?.toISOString(), { shouldValidate: true })
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {newDebitNoteForm.formState.errors.accounting_date ? (
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
          control={newDebitNoteForm.control}
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
              {newDebitNoteForm.formState.errors.payment_term ? (
                <FormMessage />
              ) :
                <FormDescription>
                  Condición de pago que se registrará en la nota de débito.
                </FormDescription>
              }
            </FormItem>
          )}
        />
        <FormField
          control={newDebitNoteForm.control}
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
              {newDebitNoteForm.formState.errors.payment_method ? (
                <FormMessage />
              ) :
                <FormDescription>
                  Método de pago que se registrará en la nota de débito.
                </FormDescription>
              }
            </FormItem>
          )}
        />
        <FormField
          control={newDebitNoteForm.control}
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
              {newDebitNoteForm.formState.errors.items?.message && (
                <p className="text-destructive text-[12.8px] mt-1 font-medium">
                  {newDebitNoteForm.formState.errors.items.message}
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
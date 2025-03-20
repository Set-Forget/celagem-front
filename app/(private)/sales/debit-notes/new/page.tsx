"use client"


import { Button } from "@/components/ui/button"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newDebitNoteSchema } from "../schemas/debit-notes"
import FormTable from "@/components/form-table"
import Header from "@/components/header"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetInvoiceQuery } from "@/lib/services/invoices"
import { cn, placeholder } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Box, CalendarIcon, Receipt } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { columns } from "./components/columns"
import TableFooter from "./components/table-footer"
import { toast } from "sonner"
import CustomSonner from "@/components/custom-sonner"
import { useCreateDebitNoteMutation } from "@/lib/services/debit-notes"

export default function NewDebitNotePage() {
  const router = useRouter()
  const params = useSearchParams()

  const invoiceId = params.get("invoiceId");

  const [createDebitNote, { isLoading: isCreatingDebitNote }] = useCreateDebitNoteMutation()
  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(invoiceId ?? "", {
    skip: !invoiceId
  });

  const newDebitNoteForm = useForm<z.infer<typeof newDebitNoteSchema>>({
    resolver: zodResolver(newDebitNoteSchema),
    defaultValues: {
      date: new Date().toISOString(),
      accounting_date: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof newDebitNoteSchema>) => {
    try {
      const response = await createDebitNote({
        ...data,
        currency: 1,
        payment_term: '2',
        number: `NC-${data.related_invoice}-${new Date().toISOString()}`,
        items: data.items.map((item) => ({
          ...item,
          taxes_id: [1]
        }))
      }).unwrap()

      if (response.status === "success") {
        // ! Debería redirigir a la página de la nota de crédito creada
        // ! Ahora no lo hace porque no tengo la página.
        router.push("/sales/invoices")
        toast.custom((t) => <CustomSonner t={t} description="Nota de crédito creada exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la nota de crédito" variant="error" />)
    }
  }

  useEffect(() => {
    if (invoice) {
      newDebitNoteForm.reset({
        partner: 1, // ! Actualmente invoice.customer es un string, debería ser un objeto.
        number: invoice.number, // ! Deberia auto-generarse y ser opcional.
        currency: 1, //invoice.currency, // ! Actualmente invoice.currency es un string, debería ser un objeto.
        move_type: "out_invoice",
        related_invoice: Number(invoiceId), // ! Mejor usar invoice.id pero por ahora no trae el id.
        items: invoice.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          taxes_id: item.taxes.map((tax) => tax.id),
        }))
      })
    }
  }, [invoice])

  return (
    <Form {...newDebitNoteForm}>
      <Header title="Nueva nota de crédito">
        <div className="flex gap-2 ml-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
          >
            Previsualizar
          </Button>
          <Button
            type="submit"
            onClick={newDebitNoteForm.handleSubmit(onSubmit)}
            size="sm"
            loading={isCreatingDebitNote}
          >
            Crear nota de crédito
          </Button>
        </div>
      </Header>
      <div className="grid grid-cols-1 gap-4 p-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-medium">General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={newDebitNoteForm.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">Fecha de emisión</FormLabel>
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
                          newDebitNoteForm.setValue("date", date?.toISOString(), { shouldValidate: true })
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {newDebitNoteForm.formState.errors.date ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Fecha en la que se emitió la factura.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
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
                  {newDebitNoteForm.formState.errors.payment_term ? (
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
        </div>
      </div>
      <Tabs className="mt-4" defaultValue="tab-1">
        <ScrollArea>
          <TabsList className="relative justify-start !pl-4 h-auto w-full gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
            <TabsTrigger
              value="tab-1"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <Receipt
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Factura
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <Box
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Proveedor
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="tab-1" className="m-0">
          <div className="p-4 flex flex-col gap-4">
            <h2 className="text-base font-medium">Factura</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Fecha de emisión</label>
                <span className={cn("text-sm transition-all duration-300", isInvoiceLoading ? "blur-[4px]" : "blur-none")}>
                  {isInvoiceLoading ? placeholder(13) : format(invoice?.date ?? "", "dd MMM yyyy", { locale: es })}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Fecha de vencimiento</label>
                <span className={cn("text-sm transition-all duration-300", isInvoiceLoading ? "blur-[4px]" : "blur-none")}>
                  {isInvoiceLoading ? placeholder(13) : format(invoice?.due_date ?? "", "dd MMM yyyy", { locale: es })}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Condición de pago</label>
                <span className={cn("text-sm transition-all duration-300", isInvoiceLoading ? "blur-[4px]" : "blur-none")}>
                  {isInvoiceLoading ? placeholder(10) : invoice?.payment_term || "No especificado"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Método de pago</label>
                <span className={cn("text-sm transition-all duration-300", isInvoiceLoading ? "blur-[4px]" : "blur-none")}>
                  {isInvoiceLoading ? placeholder(10) : invoice?.payment_method || "No especificado"}
                </span>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="tab-2" className="m-0">
          <div className="p-4 flex flex-col gap-4">
            <h2 className="text-base font-medium">Datos del proveedor</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Proveedor</label>
                <span className={cn("text-sm transition-all duration-300", isInvoiceLoading ? "blur-[4px]" : "blur-none")}>
                  xxxxx
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Correo electrónico</label>
                <span className="text-sm">
                  xxxxx
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Número de teléfono</label>
                <span className="text-sm">
                  xxxxx
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Dirección</label>
                <span className="text-sm">
                  xxxxx
                </span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Form>
  )
}
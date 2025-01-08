"use client"


import { Button } from "@/components/ui/button"

import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newInvoiceSchema } from "../schemas/invoices"

import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import ItemsTable from "./components/items-table"

export default function NewDebitNotePage() {
  const newInvoiceForm = useForm<z.infer<typeof newInvoiceSchema>>({
    resolver: zodResolver(newInvoiceSchema),
    defaultValues: {
      items: [{
        "item_code": "ITEM-9634",
        "item_name": "Intereses",
        "description": "Intereses por atraso en pago de factura",
        "quantity": 1,
        "id": "5e7361f5-0fbf-433b-8688-b65896a0f54a",
        "price": "400.93",
        "tax": "21",
      },
      ],
      customer: "Guantes S.A.",
      order_number: "OC-2002",
      invoice_number: "FA-1234",
      currency: "ARS",
    }
  })

  const onSubmit = (data: z.infer<typeof newInvoiceSchema>) => {
    console.log(data)
  }

  return (
    <>
      <Header title="Nueva nota de debito" />
      <div className="flex flex-col justify-between h-full">
        <Form {...newInvoiceForm}>
          <form onSubmit={newInvoiceForm.handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">General</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newInvoiceForm.control}
                  name="customer"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Proveedor</FormLabel>
                      <Input
                        readOnly
                        {...field}
                      />
                      {newInvoiceForm.formState.errors.customer ? (
                        <FormMessage>
                          {newInvoiceForm.formState.errors.customer.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Proveedor relacionado con la nota de crédito.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newInvoiceForm.control}
                  name="invoice_number"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Número de factura</FormLabel>
                      <Input
                        {...field}
                        readOnly
                      />
                      {newInvoiceForm.formState.errors.order_number ? (
                        <FormMessage>
                          {newInvoiceForm.formState.errors.order_number.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Número de factura relacionado con la nota de crédito.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newInvoiceForm.control}
                  name="order_number"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Orden de compra</FormLabel>
                      <Input
                        className="w-full"
                        {...field}
                        readOnly
                      />
                      {newInvoiceForm.formState.errors.order_number ? (
                        <FormMessage>
                          {newInvoiceForm.formState.errors.order_number.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Orden de compra relacionada con la nota de crédito.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={newInvoiceForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Notas</FormLabel>
                    <Textarea
                      className="resize-none"
                      {...field}
                    />
                    {newInvoiceForm.formState.errors.notes ? (
                      <FormMessage>
                        {newInvoiceForm.formState.errors.notes.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Notas adicionales relacionadas con la nota de crédito.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Fiscal</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newInvoiceForm.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Moneda</FormLabel>
                      <Input
                        readOnly
                        {...field}
                      />
                      {newInvoiceForm.formState.errors.currency ? (
                        <FormMessage>
                          {newInvoiceForm.formState.errors.currency.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Moneda en la que se emitirá la nota de crédito.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Items de la factura</span>
              <ItemsTable />
            </div>
          </form>
          <div className="flex justify-end gap-2 p-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
            >
              Previsualizar
            </Button>
            <Button
              type="submit"
              onClick={newInvoiceForm.handleSubmit(onSubmit)}
              size="sm"
            >
              Crear nota de debito
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}
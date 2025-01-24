"use client"

import { Box, CalendarIcon, House } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { v4 as uuidv4 } from 'uuid'
import { newPurchaseReceiptSchema } from "../schemas/purchase-receipts"
import ItemsTable from "./components/items-table"

const companies = [
  { label: "Google", value: "30-67890123-4" },
  { label: "Facebook", value: "30-12345678-9" },
  { label: "Microsoft", value: "33-98765432-1" },
  { label: "Apple", value: "33-11223344-5" },
  { label: "Amazon", value: "34-55667788-0" },
  { label: "Tesla", value: "30-99887766-3" },
  { label: "Netflix", value: "31-44556677-2" },
  { label: "Twitter", value: "31-77665544-8" },
  { label: "Spotify", value: "32-33445566-7" },
  { label: "Adobe", value: "33-22334455-9" },
] as const;

const headquarters = [
  { id: "hq1", name: "Main Office" },
  { id: "hq2", name: "Regional Office - North" },
  { id: "hq3", name: "Regional Office - South" },
  { id: "hq4", name: "International Office - Europe" },
  { id: "hq5", name: "International Office - Asia" },
];

export default function NewPurchaseReceivePage() {
  const newPurchaseReceipt = useForm<z.infer<typeof newPurchaseReceiptSchema>>({
    resolver: zodResolver(newPurchaseReceiptSchema),
    defaultValues: {
      items: [{
        id: uuidv4(),
        description: "Guantes de nitrilo talla M",
        received_quantity: 0,
        item_name: "Guante de nitrilo",
        item_code: "GN-001",
      }]
    }
  })

  const onSubmit = (data: z.infer<typeof newPurchaseReceiptSchema>) => {
    console.log(data)
  }

  return (
    <Form {...newPurchaseReceipt}>
      <Header title="Nueva recepción de compra" >
        <div className="flex justify-end gap-2 ml-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
          >
            Previsualizar
          </Button>
          <Button
            type="submit"
            onClick={newPurchaseReceipt.handleSubmit(onSubmit)}
            size="sm"
          >
            Crear recepción
          </Button>
        </div>
      </Header>
      <Tabs className="mt-4" defaultValue="tab-1">
        <ScrollArea>
          <TabsList className="relative justify-start !pl-4 h-auto w-full gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
            <TabsTrigger
              value="tab-1"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <House
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              General
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
              Otros
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="tab-1">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <FormField
              control={newPurchaseReceipt.control}
              name="purchase_order"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">
                    Número de orden de compra
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="432000003"
                      {...field}
                    />
                  </FormControl>
                  {newPurchaseReceipt.formState.errors.purchase_order ? (
                    <FormMessage>
                      {newPurchaseReceipt.formState.errors.purchase_order.message}
                    </FormMessage>
                  ) :
                    <FormDescription>
                      Esta será la orden de compra a la que se asociará la recepción.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
            <FormField
              control={newPurchaseReceipt.control}
              name="received_at"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">Fecha de recepción</FormLabel>
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
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {newPurchaseReceipt.formState.errors.received_at ? (
                    <FormMessage>
                      {newPurchaseReceipt.formState.errors.received_at.message}
                    </FormMessage>
                  ) :
                    <FormDescription>
                      Esta será la fecha en la que se recibió el pedido.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
            <FormField
              control={newPurchaseReceipt.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full md:col-span-2">
                  <FormLabel className="w-fit">Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Notas..."
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Estas notas serán visibles en la recepción de compra.
                  </FormDescription>
                </FormItem>
              )}
            />
            <ItemsTable className="col-span-2" />
          </div>
        </TabsContent>
        <TabsContent value="tab-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">

          </div>
        </TabsContent>
      </Tabs>
    </Form>
  )
}
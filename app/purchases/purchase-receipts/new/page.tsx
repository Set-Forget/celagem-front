"use client"

import { CalendarIcon, Check, CheckIcon, ChevronsUpDown } from "lucide-react"

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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { newPurchaseReceiptSchema } from "../schemas/purchase-receipts"
import ItemsTable from "./components/items-table"
import { v4 as uuidv4 } from 'uuid'

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
    <>
      <Header />
      <Separator />
      <div className="flex flex-col p-4">
        <Form {...newPurchaseReceipt}>
          <form onSubmit={newPurchaseReceipt.handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-[calc(100vh-183px)]">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                name="supplier"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Proveedor</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between pl-3 font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? companies.find(
                                (company) => company.value === field.value
                              )?.label
                              : "Selecciona un proveedor"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Buscar proveedores..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron proveedores.
                            </CommandEmpty>
                            <CommandGroup>
                              {companies.map((company) => (
                                <CommandItem
                                  value={company.label}
                                  key={company.value}
                                  onSelect={() => {
                                    newPurchaseReceipt.setValue("supplier", company.value)
                                  }}
                                >
                                  {company.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      company.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {newPurchaseReceipt.formState.errors.supplier ? (
                      <FormMessage>
                        {newPurchaseReceipt.formState.errors.supplier.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Este será el proveedor con el que se asociará la recepción.
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
                name="headquarter"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Sede</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between pl-3 font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? headquarters.find(
                                (cost_center) => cost_center.id === field.value?.id
                              )?.name
                              : "Selecciona una sede"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Buscar sedes..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron sedes.
                            </CommandEmpty>
                            <CommandGroup>
                              {headquarters.map((cost_center) => (
                                <CommandItem
                                  value={cost_center.id}
                                  key={cost_center.id}
                                  onSelect={() => {
                                    newPurchaseReceipt.setValue("headquarter", cost_center)
                                  }}
                                >
                                  {cost_center.name}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto",
                                      cost_center.id === field.value?.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {newPurchaseReceipt.formState.errors.headquarter ? (
                      <FormMessage>
                        {newPurchaseReceipt.formState.errors.headquarter.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Sede a la que se le asignará la solicitud de compra.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
            </div>
            <ItemsTable />
          </form>
          <div className="flex justify-end gap-2 mt-4">
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
              Crear Recepción
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}
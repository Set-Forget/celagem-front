"use client"

import { CalendarIcon, Check, CheckIcon, ChevronsUpDown, Ellipsis } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { newPurchaseOrderSchema } from "../schemas/purchase-orders"
import ItemsTable from "./components/items-table"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Box, House } from "lucide-react"
import { MultiSelect } from "@/components/multi-select"

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

export default function NewPurchaseOrderPage() {
  const newPurchaseOrderForm = useForm<z.infer<typeof newPurchaseOrderSchema>>({
    resolver: zodResolver(newPurchaseOrderSchema),
    defaultValues: {
      items: []
    }
  })

  const onSubmit = (data: z.infer<typeof newPurchaseOrderSchema>) => {
    console.log(data)
  }

  return (
    <Form {...newPurchaseOrderForm}>
      <Header title="Nueva orden de compra">
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
            onClick={newPurchaseOrderForm.handleSubmit(onSubmit)}
            size="sm"
          >
            Crear orden de compra
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
              <Ellipsis
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Otros
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="tab-1" className="m-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <FormField
              control={newPurchaseOrderForm.control}
              name="supplier_name"
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
                            : "Selecciona un cliente"}
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
                                  newPurchaseOrderForm.setValue("supplier_name", company.value)
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
                  {newPurchaseOrderForm.formState.errors.supplier_name ? (
                    <FormMessage>
                      {newPurchaseOrderForm.formState.errors.supplier_name.message}
                    </FormMessage>
                  ) :
                    <FormDescription>
                      Esta será el proveedor al que se le emitirá la orden de compra.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
            {/* <FormField
              control={newPurchaseOrderForm.control}
              name="contacts_name"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">Contactos</FormLabel>
                  <MultiSelect
                    options={contacts}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="Selecciona contactos..."
                    searchPlaceholder="Buscar contactos..."
                  />
                  {newPurchaseOrderForm.formState.errors.contacts_name ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Estos serán los contactos a los que se les enviará la orden de compra.
                    </FormDescription>
                  }
                </FormItem>
              )}
            /> */}
            <FormField
              control={newPurchaseOrderForm.control}
              name="required_by"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">Fecha de requerimiento</FormLabel>
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
                          newPurchaseOrderForm.setValue("required_by", date?.toISOString() || "")
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {newPurchaseOrderForm.formState.errors.required_by ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Esta será la fecha en la que se requiere la entrega de los productos.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
            <FormField
              control={newPurchaseOrderForm.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">Moneda</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Moneda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ARS">
                          ARS (Peso argentino)
                        </SelectItem>
                        <SelectItem value="COP">
                          COP (Peso colombiano)
                        </SelectItem>
                        <SelectItem value="USD">
                          USD (Dólar estadounidense)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {newPurchaseOrderForm.formState.errors.currency ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Esta será la moneda en la que se emitirá la orden de compra.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
            <ItemsTable className="col-span-2" />
          </div>
        </TabsContent>
        <TabsContent value="tab-2" className="m-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <FormField
              control={newPurchaseOrderForm.control}
              name="payment_terms"
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
                        <SelectItem value="anticipo">
                          Anticipo
                        </SelectItem>
                        <SelectItem value="7_dias">
                          7 días
                        </SelectItem>
                        <SelectItem value="15_dias">
                          15 días
                        </SelectItem>
                        <SelectItem value="30_dias">
                          30 días
                        </SelectItem>
                        <SelectItem value="60_dias">
                          60 días
                        </SelectItem>
                        <SelectItem value="90_dias">
                          90 días
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {newPurchaseOrderForm.formState.errors.payment_terms ? (
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
              control={newPurchaseOrderForm.control}
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
                                  newPurchaseOrderForm.setValue("headquarter", cost_center)
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
                  {newPurchaseOrderForm.formState.errors.headquarter ? (
                    <FormMessage>
                      {newPurchaseOrderForm.formState.errors.headquarter.message}
                    </FormMessage>
                  ) :
                    <FormDescription>
                      Sede a la que se le asignará la solicitud de compra.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
            <FormField
              control={newPurchaseOrderForm.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full md:col-span-2">
                  <FormLabel className="w-fit">Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Notas internas..."
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Estas notas son internas y no se incluirán en la orden de compra.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={newPurchaseOrderForm.control}
              name="terms_and_conditions"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full md:col-span-2">
                  <FormLabel className="w-fit">Terminos y condiciones</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Terminos y condiciones..."
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Estos términos y condiciones se incluirán en la orden de compra.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        </TabsContent>
      </Tabs>
    </Form>
  )
}
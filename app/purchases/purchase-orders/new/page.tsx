"use client"

import { CalendarIcon, Check, CheckIcon, ChevronsUpDown } from "lucide-react"

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

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ItemsTable from "./components/items-table"
import Header from "@/components/header"
import { Separator } from "@/components/ui/separator"
import { newPurchaseOrderSchema } from "../schemas/purchase-orders"
import { Textarea } from "@/components/ui/textarea"

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
    <>
      <Header />
      <Separator />
      <div className="flex flex-col p-4 h-full">
        <Form {...newPurchaseOrderForm}>
          <form onSubmit={newPurchaseOrderForm.handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-full">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        Esta será el proveedor al que se le emitirá la factura.
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
                      <Select onValueChange={field.onChange}>
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
                      <FormMessage>
                        {newPurchaseOrderForm.formState.errors.currency.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Esta será la moneda en la que se emitirá la factura.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
              <FormField
                control={newPurchaseOrderForm.control}
                name="purchase_order_date"
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
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {newPurchaseOrderForm.formState.errors.purchase_order_date ? (
                      <FormMessage>
                        {newPurchaseOrderForm.formState.errors.purchase_order_date.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Esta será la fecha en la que se emite la orden de compra.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
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
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {newPurchaseOrderForm.formState.errors.required_by ? (
                      <FormMessage>
                        {newPurchaseOrderForm.formState.errors.required_by.message}
                      </FormMessage>
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
            </div>
            <FormField
              control={newPurchaseOrderForm.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Entregar en recepción..."
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Estas notas se imprimirán en la orden de compra.
                  </FormDescription>
                </FormItem>
              )}
            />
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
              onClick={newPurchaseOrderForm.handleSubmit(onSubmit)}
              size="sm"
            >
              Crear Orden
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}
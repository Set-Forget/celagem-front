"use client"

import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"

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
import { newInvoiceSchema } from "./schemas/invoices"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ItemsTable from "./components/items-table"
import Header from "@/components/header"
import { Separator } from "@/components/ui/separator"

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

export default function NewInvoicePage() {
  const newInvoiceForm = useForm<z.infer<typeof newInvoiceSchema>>({
    resolver: zodResolver(newInvoiceSchema),
    defaultValues: {
      items: []
    }
  })

  const onSubmit = (data: z.infer<typeof newInvoiceSchema>) => {
    console.log(data)
  }

  return (
    <div>
      <Header />
      <Separator />
      <div className="flex flex-col p-4">
        <Form {...newInvoiceForm}>
          <form onSubmit={newInvoiceForm.handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-[calc(100vh-183px)]">
            <div className="flex gap-4">
              <FormField
                control={newInvoiceForm.control}
                name="customer"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Cliente</FormLabel>
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
                            placeholder="Buscar clientes..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron clientes.
                            </CommandEmpty>
                            <CommandGroup>
                              {companies.map((company) => (
                                <CommandItem
                                  value={company.label}
                                  key={company.value}
                                  onSelect={() => {
                                    newInvoiceForm.setValue("customer", company.value)
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
                    {newInvoiceForm.formState.errors.customer ? (
                      <FormMessage>
                        {newInvoiceForm.formState.errors.customer.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Esta será la empresa a la que se le emitirá la factura.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
              <FormField
                control={newInvoiceForm.control}
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
                    {newInvoiceForm.formState.errors.currency ? (
                      <FormMessage>
                        {newInvoiceForm.formState.errors.currency.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Esta será la moneda en la que se emitirá la factura.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4">
              <FormField
                control={newInvoiceForm.control}
                name="invoice_date"
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
                    {newInvoiceForm.formState.errors.invoice_date ? (
                      <FormMessage>
                        {newInvoiceForm.formState.errors.invoice_date.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Esta será la fecha en la que se emite la factura.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
              <FormField
                control={newInvoiceForm.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Fecha de vencimiento</FormLabel>
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
                    {newInvoiceForm.formState.errors.due_date ? (
                      <FormMessage>
                        {newInvoiceForm.formState.errors.due_date.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Esta será la fecha en la que vence la factura.
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
              onClick={newInvoiceForm.handleSubmit(onSubmit)}
              size="sm"
            >
              Crear Factura
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
"use client"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, CheckIcon, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newPurchaseRequestSchema } from "../schemas/purchase-requests"
import FormTable from "./components/form-table"
import { columns as item_columns } from "./components/items-columns"
import { columns as supplier_columns } from "./components/provider-columns"
import ItemsTableFooter from "./components/items-table-footer"
import SuppliersTableFooter from "./components/suppliers-table-footer"
import { Separator } from "@/components/ui/separator"

const headquarters = [
  { id: "hq1", name: "Main Office" },
  { id: "hq2", name: "Regional Office - North" },
  { id: "hq3", name: "Regional Office - South" },
  { id: "hq4", name: "International Office - Europe" },
  { id: "hq5", name: "International Office - Asia" },
];

export default function NewPurchaseRequestPage() {
  const newPurchaseRequest = useForm<z.infer<typeof newPurchaseRequestSchema>>({
    resolver: zodResolver(newPurchaseRequestSchema),
    defaultValues: {
      items: [],
      suppliers: [],
    }
  })

  const onSubmit = (data: z.infer<typeof newPurchaseRequestSchema>) => {
    console.log(data)
  }

  return (
    <>
      <Header />
      <div className="flex flex-col h-full justify-between">
        <Form {...newPurchaseRequest}>
          <form onSubmit={newPurchaseRequest.handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">General</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newPurchaseRequest.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Titulo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Titulo"
                          {...field}
                        />
                      </FormControl>
                      {newPurchaseRequest.formState.errors.title ? (
                        <FormMessage>
                          {newPurchaseRequest.formState.errors.title.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el título de la solicitud de compra.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPurchaseRequest.control}
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
                      {newPurchaseRequest.formState.errors.required_by ? (
                        <FormMessage>
                          {newPurchaseRequest.formState.errors.required_by.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la fecha en la que se requiere la compra.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPurchaseRequest.control}
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
                                      newPurchaseRequest.setValue("headquarter", cost_center)
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
                      {newPurchaseRequest.formState.errors.headquarter ? (
                        <FormMessage>
                          {newPurchaseRequest.formState.errors.headquarter.message}
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
                control={newPurchaseRequest.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Notas</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        placeholder="Notas"
                        {...field}
                      />
                    </FormControl>
                    {newPurchaseRequest.formState.errors.notes ? (
                      <FormMessage>
                        {newPurchaseRequest.formState.errors.notes.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Estas notas serán visibles en la solicitud de compra.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Items de la solicitud</span>
              <FormTable
                name="items"
                label="Items"
                columns={item_columns}
                footer={({ append }) => <ItemsTableFooter append={append} />}
              />
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Proveedores de la solicitud</span>
              <FormTable
                name="suppliers"
                label="Proveedores"
                columns={supplier_columns}
                footer={({ append }) => <SuppliersTableFooter append={append} />}
              />
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
              onClick={newPurchaseRequest.handleSubmit(onSubmit)}
              size="sm"
            >
              Crear solicitud
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}
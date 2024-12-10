"use client"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newJournalEntrySchema } from "../schemas/journal-entries"
import ItemsTable from "./components/items-table"

export default function NewJournalEntryPage() {
  const newJournalEntryForm = useForm<z.infer<typeof newJournalEntrySchema>>({
    resolver: zodResolver(newJournalEntrySchema),
    defaultValues: {
      date: new Date().toISOString(),
      items: []
    }
  })

  const onSubmit = (data: z.infer<typeof newJournalEntrySchema>) => {
    console.log(data)
  }

  return (
    <>
      <Header title="Nuevo asiento" />
      <Separator />
      <div className="flex flex-col h-full justify-between">
        <Form {...newJournalEntryForm}>
          <form onSubmit={newJournalEntryForm.handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Información del asiento</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newJournalEntryForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Título
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ajuste"
                        />
                      </FormControl>
                      {newJournalEntryForm.formState.errors.title ? (
                        <FormMessage>
                          {newJournalEntryForm.formState.errors.title.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el título del asiento contable.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newJournalEntryForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Fecha del asiento</FormLabel>
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
                      {newJournalEntryForm.formState.errors.date ? (
                        <FormMessage>
                          {newJournalEntryForm.formState.errors.date.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la fecha del asiento contable.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={newJournalEntryForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">
                      Notas
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Notas del asiento"
                        className="resize-none"
                      />
                    </FormControl>
                    {newJournalEntryForm.formState.errors.notes ? (
                      <FormMessage>
                        {newJournalEntryForm.formState.errors.notes.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Estas serán las notas del asiento contable.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Items del asiento</span>
              <ItemsTable />
            </div>
          </form>
          <div className="flex justify-end gap-2 mt-4 p-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
            >
              Previsualizar
            </Button>
            <Button
              type="submit"
              onClick={newJournalEntryForm.handleSubmit(onSubmit)}
              size="sm"
            >
              Crear Asiento
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}
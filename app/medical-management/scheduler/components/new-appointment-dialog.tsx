'use client'

import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { closeDialogs, DialogsState, dialogsStateObservable, getDialogsState } from "@/lib/store/dialogs-store";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { newAppointmentSchema } from "../schemas/appointments";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { AsyncSelect } from "@/components/async-select";
import { PATIENT_DATA } from "../../patients/page";

const APPOINTMENT_TYPES = [
  {
    value: "ovo-contributor",
    label: "Ovo-Aportante",
  },
  {
    value: "pregnant",
    label: "Gestante",
  },
  {
    value: "semen-contributor",
    label: "Aportante de semen",
  },
]

const HEADQUARTERS = [
  {
    value: "1",
    label: "Sede Asistencial Bogotá",
  },
  {
    value: "2",
    label: "Sede Asistencial Bucamaranga",
  },
  {
    value: "3",
    label: "Sede Medellín",
  },
]

export default function NewAppointmentDialog() {
  // No es necesario, se puede extraer directamente de dialogState
  const selectedDate = getDialogsState().payload?.date

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const newAppointmentForm = useForm<z.infer<typeof newAppointmentSchema>>({
    resolver: zodResolver(newAppointmentSchema),
    defaultValues: {
      time_allocation: "diary",
      attention_types: [],
      start_date: "",
    }
  });

  const onOpenChange = () => {
    closeDialogs()
    newAppointmentForm.reset()
  }

  function handleTimeChange(type: "hour" | "minute", value: string, field: any) {
    const newDate = new Date(newAppointmentForm.getValues(field.name));
    if (type === "hour") {
      newDate.setHours(parseInt(value));
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value));
    }
    field.onChange(newDate.toISOString());
  }

  function onSubmit(data: z.infer<typeof newAppointmentSchema>) {
    console.log(data)
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const startDate = useWatch({ control: newAppointmentForm.control, name: "start_date" });

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState)

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  console.log(selectedDate)
  useEffect(() => {
    if (selectedDate) {
      newAppointmentForm.setValue("start_date", selectedDate.toISOString())
    }
  }, [selectedDate])

  return (
    <Dialog
      open={dialogState.open === "new-appointment"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Nuevo turno</DialogTitle>
          <DialogDescription>
            Completa el formulario para crear un nuevo turno.
          </DialogDescription>
        </DialogHeader>
        <Form {...newAppointmentForm}>
          <form onSubmit={newAppointmentForm.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={newAppointmentForm.control}
              name="time_allocation"
              defaultValue={newAppointmentForm.getValues("time_allocation")}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de asignación de horas</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center gap-4 !mt-2"
                    >
                      <FormItem className="flex items-center space-x-1 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="diary" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Diario
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-1 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="consecutive" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Consecutivo
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <FormField
                control={newAppointmentForm.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="w-fit">Fecha de inicio</FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP - hh:mm a")
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="sm:flex">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString())}
                            initialFocus
                          />
                          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x">
                            <ScrollArea className="w-64 sm:w-auto h-[300px]">
                              <div className="flex sm:flex-col-reverse p-2">
                                {hours.map((hour) => {
                                  const isDisabled = !field.value;
                                  return (
                                    <Button
                                      key={hour}
                                      size="icon"
                                      variant={
                                        new Date(field.value) &&
                                          new Date(field.value).getHours() === hour
                                          ? "default"
                                          : "ghost"
                                      }
                                      className={cn("sm:w-full shrink-0 aspect-square")}
                                      disabled={isDisabled}
                                      onClick={() =>
                                        !isDisabled && handleTimeChange("hour", hour.toString(), field)
                                      }
                                    >
                                      {hour < 10 ? `0${hour}` : hour}
                                    </Button>
                                  );
                                })}
                              </div>
                            </ScrollArea>
                            <ScrollArea className="w-64 sm:w-auto h-[300px]">
                              <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 2 }, (_, i) => i * 30).map((minute) => {
                                  const isDisabled = !field.value;
                                  return (
                                    <Button
                                      key={minute}
                                      size="icon"
                                      variant={
                                        new Date(field.value) &&
                                          new Date(field.value).getMinutes() === minute
                                          ? "default"
                                          : "ghost"
                                      }
                                      className={cn("sm:w-full shrink-0 aspect-square")}
                                      disabled={isDisabled}
                                      onClick={() =>
                                        !isDisabled && handleTimeChange("minute", minute.toString(), field)
                                      }
                                    >
                                      {minute.toString().padStart(2, "0")}
                                    </Button>
                                  );
                                })}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newAppointmentForm.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="w-fit">Fecha de fin</FormLabel>
                    <Popover modal>
                      <PopoverTrigger
                        disabled={!startDate}
                        asChild
                      >
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP - hh:mm a")
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="sm:flex">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString())}
                            disabled={(date) => {
                              if (!startDate) return false;
                              const startDateOnly = new Date(startDate);
                              startDateOnly.setHours(0, 0, 0, 0);
                              const currentDateOnly = new Date(date);
                              currentDateOnly.setHours(0, 0, 0, 0);
                              return currentDateOnly < startDateOnly;
                            }}
                            initialFocus
                          />
                          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x">
                            <ScrollArea className="w-64 sm:w-auto h-[300px]">
                              <div className="flex sm:flex-col-reverse p-2">
                                {hours.map((hour) => {
                                  const isSameDay =
                                    new Date(startDate).toDateString() ===
                                    new Date(field.value).toDateString();
                                  const isDisabled = (isSameDay && hour < new Date(startDate).getHours() || !field.value)
                                  return (
                                    <Button
                                      key={hour}
                                      size="icon"
                                      variant={
                                        new Date(field.value) &&
                                          new Date(field.value).getHours() === hour
                                          ? "default"
                                          : "ghost"
                                      }
                                      className={cn(
                                        "sm:w-full shrink-0 aspect-square",
                                      )}
                                      disabled={isDisabled}
                                      onClick={() =>
                                        !isDisabled && handleTimeChange("hour", hour.toString(), field)
                                      }
                                    >
                                      {hour < 10 ? `0${hour}` : hour}
                                    </Button>
                                  );
                                })}
                              </div>
                            </ScrollArea>
                            <ScrollArea className="w-64 sm:w-auto h-[300px]">
                              <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 2 }, (_, i) => i * 30).map((minute) => {
                                  const isSameDay =
                                    new Date(startDate).toDateString() ===
                                    new Date(field.value).toDateString();
                                  const isSameHour =
                                    isSameDay &&
                                    new Date(field.value).getHours() ===
                                    new Date(startDate).getHours();
                                  const isDisabled = (isSameHour && minute < new Date(startDate).getMinutes() || !field.value)
                                  return (
                                    <Button
                                      key={minute}
                                      size="icon"
                                      variant={
                                        new Date(field.value) &&
                                          new Date(field.value).getMinutes() === minute
                                          ? "default"
                                          : "ghost"
                                      }
                                      className={cn("sm:w-full shrink-0 aspect-square")}
                                      disabled={isDisabled}
                                      onClick={() =>
                                        !isDisabled && handleTimeChange("minute", minute.toString(), field)
                                      }
                                    >
                                      {minute.toString().padStart(2, "0")}
                                    </Button>
                                  );
                                })}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2 items-center flex-1">
              <FormField
                control={newAppointmentForm.control}
                name="attention_types"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Tipos de atención</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={APPOINTMENT_TYPES}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        placeholder="Seleccionar tipos de atención"
                        variant="default"
                        modalPopover
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newAppointmentForm.control}
                name="patient_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Paciente</FormLabel>
                    <FormControl>
                      <AsyncSelect<any>
                        label="Paciente"
                        triggerClassName="!w-full"
                        placeholder="Seleccionar paciente"
                        fetcher={async (query) => {
                          await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 100))
                          if (query) {
                            const lowercaseQuery = query.toLowerCase()
                            return PATIENT_DATA.filter(user =>
                              user.name.toLowerCase().includes(lowercaseQuery)
                            ).slice(0, 10)
                          }
                          return PATIENT_DATA.slice(0, 10)
                        }}
                        getDisplayValue={(item) => item.name + " " + item.lastname}
                        getOptionValue={(item) => item.id}
                        renderOption={(item) => <div>{item.name}{" "}{item.lastname}</div>}
                        onChange={field.onChange}
                        value={field.value}
                        noResultsMessage="No se encontraron pacientes"
                        modal
                        actionButton={
                          <Button size="sm" variant="outline" className="border-0 border-t">
                            <Plus />
                            Crear paciente
                          </Button>
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={newAppointmentForm.control}
              name="headquarter_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="w-fit">Sede</FormLabel>
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between font-normal pl-3",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? HEADQUARTERS.find(
                              (language) => language.value === field.value
                            )?.label
                            : "Seleccionar sede"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Buscar sede"
                          className="h-8"
                        />
                        <CommandList>
                          <CommandEmpty>No se encontraron resultados</CommandEmpty>
                          <CommandGroup>
                            {HEADQUARTERS.map((headquarter) => (
                              <CommandItem
                                value={headquarter.label}
                                key={headquarter.value}
                                onSelect={() => {
                                  newAppointmentForm.setValue("headquarter_id", headquarter.value)
                                }}
                              >
                                {headquarter.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    headquarter.value === field.value
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newAppointmentForm.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribe tus notas aquí"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button size="sm">Crear</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
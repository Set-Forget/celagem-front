'use client'

import { AsyncSelect } from "@/components/async-select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { cn } from "@/lib/utils";
import { medicalManagementApi, useCreateAppointmentMutation } from "@/services/appointments";
import { store } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, Loader2Icon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { newAppointmentSchema } from "../schemas/appointments";
import TEMPLATES from "../templates/templates.json";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import omit from "lodash/omit";

const clinics = [
  {
    value: "0194dcb5-24e0-76cf-a07f-62eb78f8b296",
    label: "Prueba 1",
  },
]

const doctors = [
  {
    label: "Dr. Juan Pérez",
    value: "0194cd16-08cb-7146-b224-52417ab62d3b",
  }
]

export default function NewAppointmentDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const selectedDate = dialogState.payload?.date

  const [createAppointment, { isLoading }] = useCreateAppointmentMutation()

  const newAppointmentForm = useForm<z.infer<typeof newAppointmentSchema>>({
    resolver: zodResolver(newAppointmentSchema),
    defaultValues: {
      created_by: "0194cd16-08cb-7146-b224-52417ab62d3b",
      status_id: 4,
      care_type_id: 5
    }
  });

  console.log(newAppointmentForm.formState.errors)

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

  async function onSubmit(data: z.infer<typeof newAppointmentSchema>) {
    try {
      const filteredData = omit(data, ["attention_type"])
      const response = await createAppointment({
        ...filteredData,
        start_date: format(new Date(filteredData.start_date), "yyyy-MM-dd"),
        end_date: format(new Date(filteredData.end_date), "yyyy-MM-dd"),
        start_time: format(new Date(filteredData.start_date), "HH:mm"),
        end_time: format(new Date(filteredData.end_date), "HH:mm"),
      }).unwrap();

      if (response.status === "SUCCESS") {
        closeDialogs()
      }
    } catch (error) {
      console.error("Error al crear turno:", error)
    }
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const startDate = useWatch({ control: newAppointmentForm.control, name: "start_date" });

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState)
    return () => {
      subscription.unsubscribe()
    }
  }, [])

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
      <DialogContent className="w-[650px] max-w-none">
        <DialogHeader>
          <DialogTitle>Nuevo turno</DialogTitle>
          <DialogDescription>
            Completa el formulario para crear un nuevo turno.
          </DialogDescription>
        </DialogHeader>
        <Form {...newAppointmentForm}>
          <form onSubmit={newAppointmentForm.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={newAppointmentForm.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Fecha de inicio</FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <p className="truncate w-full">
                              {field.value ? (
                                format(new Date(field.value), "PPP - hh:mm a")
                              ) : (
                                <span>Seleccionar fecha</span>
                              )}
                            </p>
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
                  <FormItem className="flex flex-col w-full">
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
                              "pl-3 text-left font-normal",
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
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={newAppointmentForm.control}
                name="doctor_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Profesional</FormLabel>
                    <FormControl>
                      <AsyncSelect<{ label: string, value: string }>
                        label="Profesional"
                        triggerClassName="!w-full"
                        placeholder="Seleccionar un profesional"
                        fetcher={async () => {
                          return doctors
                          /*                      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 100))
                                               if (query) {
                                                 const lowercaseQuery = query.toLowerCase()
                                                 return PATIENT_DATA.filter(user =>
                                                   user.name.toLowerCase().includes(lowercaseQuery)
                                                 ).slice(0, 10)
                                               }
                                               return PATIENT_DATA.slice(0, 10) */
                        }}
                        getDisplayValue={(item) => item.label}
                        getOptionValue={(item) => item.value}
                        renderOption={(item) => <div>{item.label}</div>}
                        onChange={field.onChange}
                        value={field.value}
                        noResultsMessage="No se encontraron profesionales"
                        modal
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
                      <AsyncSelect<{ label: string, value: string }>
                        label="Paciente"
                        triggerClassName="!w-full"
                        placeholder="Seleccionar paciente"
                        fetcher={async () => {
                          //const params = query ? { search: { query } } : {};
                          try {
                            const patients = await store
                              .dispatch(medicalManagementApi.endpoints.listPatients.initiate(/* params */))
                              .unwrap();

                            const formattedPatients = patients.data.map((patient) => ({
                              label: `${patient.first_name} ${patient.first_last_name}`,
                              value: patient.id,
                            }));

                            return formattedPatients;
                          } catch (error) {
                            console.error("Error al obtener pacientes:", error);
                            return [];
                          }
                        }}
                        getDisplayValue={(item) => item.label}
                        getOptionValue={(item) => item.value}
                        renderOption={(item) => <div>{item.label}</div>}
                        onChange={field.onChange}
                        value={field.value}
                        noResultsMessage="No se encontraron pacientes"
                        modal
                        actionButton={
                          <Button size="sm" variant="outline" className="border-0 border-t rounded-none">
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
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={newAppointmentForm.control}
                name="attention_type"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Tipo de atención</FormLabel>
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
                            <p className="truncate">
                              {field.value
                                ? TEMPLATES.find(
                                  (template) => template.template === field.value
                                )?.template
                                : "Seleccionar tipo de atención"}
                            </p>
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0">
                        <Command>
                          <CommandInput
                            placeholder="Buscar..."
                            className="h-8"
                          />
                          <CommandList>
                            <CommandEmpty>No se encontraron resultados</CommandEmpty>
                            <CommandGroup>
                              {TEMPLATES.map((template) => (
                                <CommandItem
                                  value={template.template}
                                  key={template.id}
                                  onSelect={() => {
                                    newAppointmentForm.setValue("attention_type", template.template)
                                  }}
                                >
                                  {template.template}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      template.template === field.value
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
                name="clinic_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
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
                              ? clinics.find(
                                (clinic) => clinic.value === field.value
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
                              {clinics.map((clinic) => (
                                <CommandItem
                                  value={clinic.label}
                                  key={clinic.value}
                                  onSelect={() => {
                                    newAppointmentForm.setValue("clinic_id", clinic.value)
                                  }}
                                >
                                  {clinic.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      clinic.value === field.value
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
            </div>
            <FormField
              control={newAppointmentForm.control}
              name="mode_of_care"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Modo de atención</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar modo de atención" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IN_PERSON">Presencial</SelectItem>
                      <SelectItem value="VIRTUAL">Virtual</SelectItem>
                    </SelectContent>
                  </Select>
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
              <Button
                disabled={isLoading}
                size="sm"
              >
                {isLoading && <Loader2Icon className="animate-spin" />}
                Crear turno
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
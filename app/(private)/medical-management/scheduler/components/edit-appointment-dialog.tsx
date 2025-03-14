'use client'

import { AsyncSelect } from "@/components/async-select";
import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateAppointmentMutation } from "@/lib/services/appointments";
import { useListBusinessUnitsQuery } from "@/lib/services/business-units";
import { useLazyListPatientsQuery } from "@/lib/services/patients";
import { useLazyListUsersQuery } from "@/lib/services/users";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import omit from "lodash/omit";
import { CalendarIcon, Check, ChevronsUpDown, Clock, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { ControllerRenderProps, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AppointmentList, newAppointmentSchema } from "../schemas/appointments";
import TEMPLATES from "../templates/templates.json";

export default function EditAppointmentDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const appointment = dialogState.payload?.appointment as AppointmentList;

  const [updateAppointment, { isLoading }] = useUpdateAppointmentMutation();

  const { data: businessUnits } = useListBusinessUnitsQuery();
  const [getPatients] = useLazyListPatientsQuery();
  const [getDoctors] = useLazyListUsersQuery();

  const editAppointmentForm = useForm<z.infer<typeof newAppointmentSchema>>({
    resolver: zodResolver(newAppointmentSchema),
    defaultValues: {
      created_by: appointment?.created_by.id || "",
      care_type_id: 1, //para ver
      status_id: 1, //para ver
      start_date: appointment?.start_date || "",
      start_time: appointment?.start_time || "",
      end_date: appointment?.end_date || "",
      end_time: appointment?.end_time || "",
      doctor_id: appointment?.doctor.id || "",
      patient_id: appointment?.patient.id || "",
      clinic_id: appointment?.clinic_id || "",
      notes: appointment?.notes || "",
      mode_of_care: appointment?.mode_of_care || "IN_PERSON",
    }
  });

  const onOpenChange = () => {
    closeDialogs();
    editAppointmentForm.reset();
  };

  const handleTimeChange = (
    type: "hour" | "minute",
    value: string,
    field: ControllerRenderProps<z.infer<typeof newAppointmentSchema>>
  ) => {
    const currentValue = editAppointmentForm.getValues(field.name);
    let newDate: Date;

    if (currentValue && !isNaN(new Date(currentValue).getTime())) {
      newDate = new Date(currentValue);
    } else if (appointment?.start_date) {
      newDate = new Date(appointment.start_date);
    } else {
      newDate = new Date();
    }

    if (type === "hour") {
      newDate.setHours(parseInt(value, 10));
      newDate.setMinutes(0);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    }

    field.onChange(newDate.toISOString());
  };

  const handleGetPatients = async () => {
    try {
      const patients = await getPatients().unwrap();
      return patients.data.map((patient) => ({
        label: `${patient.first_name} ${patient.first_last_name}`,
        value: patient.id,
      }));
    } catch (error) {
      console.error("Error al obtener pacientes:", error);
      return [];
    }
  };

  const handleGetDoctors = async () => {
    try {
      const doctors = await getDoctors().unwrap();
      return doctors.data.map((doctor) => ({
        label: `${doctor.first_name} ${doctor.last_name}`,
        value: doctor.id,
      }));
    } catch (error) {
      console.error("Error al obtener doctores:", error);
      return [];
    }
  };

  async function onSubmit(data: z.infer<typeof newAppointmentSchema>) {
    try {
      const filteredData = omit(data, ["attention_type"]);
      const response = await updateAppointment({
        id: appointment?.id,
        body: {
          ...filteredData,
          start_date: format(new Date(data.start_date), "yyyy-MM-dd"),
          end_date: format(new Date(data.end_date), "yyyy-MM-dd"),
          start_time: format(new Date(data.start_time), "HH:mm"),
          end_time: format(new Date(data.end_time), "HH:mm"),
        }
      }).unwrap();

      if (response.status === "SUCCESS") {
        onOpenChange();
        toast.custom((t) => <CustomSonner t={t} description="Turno actualizado correctamente" />);
      }
    } catch {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar el turno" variant="error" />);
    }
  }

  const hours = Array.from({ length: 12 }, (_, i) => i + 7);
  const minutes = [0, 30];

  const startDate = useWatch({ control: editAppointmentForm.control, name: "start_date" });
  const endDate = useWatch({ control: editAppointmentForm.control, name: "end_date" });

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (appointment) {
      editAppointmentForm.setValue("start_date", parse(appointment.start_date, "yyyy-MM-dd", new Date()).toISOString());
      editAppointmentForm.setValue("start_time", parse(appointment.start_time, "HH:mm", new Date()).toISOString());
      editAppointmentForm.setValue("end_date", parse(appointment.end_date, "yyyy-MM-dd", new Date()).toISOString());
      editAppointmentForm.setValue("end_time", parse(appointment.end_time, "HH:mm", new Date()).toISOString());
      editAppointmentForm.setValue("doctor_id", appointment.doctor.id);
      editAppointmentForm.setValue("patient_id", appointment.patient.id);
      editAppointmentForm.setValue("clinic_id", appointment.clinic_id);
      editAppointmentForm.setValue("notes", appointment.notes || "");
      editAppointmentForm.setValue("mode_of_care", appointment.mode_of_care);
      editAppointmentForm.setValue("created_by", appointment.created_by.id);
    }
  }, [appointment]);

  return (
    <Dialog
      open={dialogState.open === "edit-appointment"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="w-[650px] max-w-none">
        <DialogHeader>
          <DialogTitle>Editar turno</DialogTitle>
          <DialogDescription>
            Actualiza la información del turno.
          </DialogDescription>
        </DialogHeader>
        <Form {...editAppointmentForm}>
          <form onSubmit={editAppointmentForm.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={editAppointmentForm.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Fecha de inicio</FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <p className="truncate w-full">
                              {field.value ? format(new Date(field.value), "PPP") : <span>Seleccionar fecha</span>}
                            </p>
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            field.onChange(date?.toISOString());
                            editAppointmentForm.setValue("end_date", "");
                            editAppointmentForm.setValue("end_time", "");
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editAppointmentForm.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Hora de inicio</FormLabel>
                    <Popover modal>
                      <PopoverTrigger disabled={!startDate} asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(new Date(field.value), "hh:mm a") : <span>Seleccionar hora</span>}
                            <Clock className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x">
                          <ScrollArea className="w-64 sm:w-auto h-[300px]">
                            <div className="flex flex-col p-2">
                              {hours.map((hour) => {
                                const isSameDay = new Date(startDate).toDateString() === new Date(field.value).toDateString();
                                const startHour = new Date(startDate).getHours();
                                let isDisabled: boolean = false;
                                if (isSameDay) {
                                  isDisabled = hour < startHour;
                                }
                                return (
                                  <Button
                                    key={hour}
                                    size="icon"
                                    variant={field.value && new Date(field.value).getHours() === hour ? "default" : "ghost"}
                                    className={cn("sm:w-full shrink-0 aspect-square")}
                                    disabled={isDisabled}
                                    onClick={() => {
                                      handleTimeChange("hour", hour.toString(), field);
                                      editAppointmentForm.setValue("start_time", "");
                                    }}
                                  >
                                    {hour < 10 ? `0${hour}` : hour}
                                  </Button>
                                );
                              })}
                            </div>
                          </ScrollArea>
                          <ScrollArea className="w-64 sm:w-auto h-[300px]">
                            <div className="flex sm:flex-col p-2">
                              {minutes.map((minute) => {
                                const isSameDay = new Date(startDate).toDateString() === new Date(field.value).toDateString();
                                const isSameHour = isSameDay && new Date(field.value).getHours() === new Date(startDate).getHours();
                                let isDisabled = !field.value;
                                if (isSameHour && minute < new Date(startDate).getMinutes()) {
                                  isDisabled = true;
                                }
                                if (field.value) {
                                  const selectedHour = new Date(field.value).getHours();
                                  if (selectedHour === 18 && minute > 0) {
                                    isDisabled = true;
                                  }
                                }
                                return (
                                  <Button
                                    key={minute}
                                    size="icon"
                                    variant={field.value && new Date(field.value).getMinutes() === minute ? "default" : "ghost"}
                                    className={cn("sm:w-full shrink-0 aspect-square")}
                                    disabled={isDisabled}
                                    onClick={() => handleTimeChange("minute", minute.toString(), field)}
                                  >
                                    {minute.toString().padStart(2, "0")}
                                  </Button>
                                );
                              })}
                            </div>
                          </ScrollArea>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editAppointmentForm.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Fecha de fin</FormLabel>
                    <Popover modal>
                      <PopoverTrigger disabled={!startDate} asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(new Date(field.value), "PPP") : <span>Seleccionar fecha</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            field.onChange(date?.toISOString());
                            editAppointmentForm.setValue("end_time", "");
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editAppointmentForm.control}
                name="end_time"
                render={({ field }) => {
                  const endTimeDate =
                    field.value && !isNaN(new Date(field.value).getTime())
                      ? new Date(field.value)
                      : endDate
                        ? new Date(endDate)
                        : new Date(startDate);

                  const startTimeValue = editAppointmentForm.getValues("start_time");
                  const startTimeDate =
                    startTimeValue && !isNaN(new Date(startTimeValue).getTime())
                      ? new Date(startTimeValue)
                      : new Date(startDate);

                  const startDay = new Date(startDate).setHours(0, 0, 0, 0);
                  const endDay = endDate
                    ? new Date(endDate).setHours(0, 0, 0, 0)
                    : new Date(startDate).setHours(0, 0, 0, 0);
                  const isSameDay = startDay === endDay;

                  const startHour = startTimeDate.getHours();
                  const startMinute = startTimeDate.getMinutes();

                  return (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Hora de fin</FormLabel>
                      <Popover modal>
                        <PopoverTrigger disabled={!endDate} asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                              {field.value ? format(new Date(field.value), "hh:mm a") : <span>Seleccionar hora</span>}
                              <Clock className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x">
                            <ScrollArea className="w-64 sm:w-auto h-[300px]">
                              <div className="flex flex-col p-2">
                                {hours.map((hour) => {
                                  const isDisabled = isSameDay && hour < startHour;
                                  return (
                                    <Button
                                      key={hour}
                                      size="icon"
                                      variant={field.value && new Date(field.value).getHours() === hour ? "default" : "ghost"}
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
                                {minutes.map((minute) => {
                                  let isDisabled = false;
                                  if (isSameDay && endTimeDate.getHours() === startHour) {
                                    isDisabled = minute < startMinute;
                                  }
                                  if (field.value) {
                                    const selectedHour = new Date(field.value).getHours();
                                    if (selectedHour === 18 && minute > 0) {
                                      isDisabled = true;
                                    }
                                  }
                                  return (
                                    <Button
                                      key={minute}
                                      size="icon"
                                      variant={field.value && new Date(field.value).getMinutes() === minute ? "default" : "ghost"}
                                      className={cn("sm:w-full shrink-0 aspect-square")}
                                      disabled={isDisabled}
                                      onClick={() => !isDisabled && handleTimeChange("minute", minute.toString(), field)}
                                    >
                                      {minute.toString().padStart(2, "0")}
                                    </Button>
                                  );
                                })}
                              </div>
                            </ScrollArea>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={editAppointmentForm.control}
                name="doctor_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Profesional</FormLabel>
                    <FormControl>
                      <AsyncSelect<{ label: string, value: string }, string>
                        label="Profesional"
                        triggerClassName="!w-full"
                        placeholder="Seleccionar un profesional"
                        fetcher={handleGetDoctors}
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
                control={editAppointmentForm.control}
                name="patient_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Paciente</FormLabel>
                    <FormControl>
                      <AsyncSelect<{ label: string, value: string }, string>
                        label="Paciente"
                        triggerClassName="!w-full"
                        placeholder="Seleccionar paciente"
                        fetcher={handleGetPatients}
                        getDisplayValue={(item) => item.label}
                        getOptionValue={(item) => item.value}
                        renderOption={(item) => <div>{item.label}</div>}
                        onChange={field.onChange}
                        value={field.value}
                        noResultsMessage="No se encontraron pacientes"
                        modal
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editAppointmentForm.control}
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
                            className={cn("justify-between font-normal pl-3", !field.value && "text-muted-foreground")}
                          >
                            <p className="truncate">
                              {field.value
                                ? TEMPLATES.find((template) => template.template === field.value)?.template
                                : "Seleccionar tipo de atención"}
                            </p>
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0">
                        <Command>
                          <CommandInput placeholder="Buscar..." className="h-8" />
                          <CommandList>
                            <CommandEmpty>No se encontraron resultados</CommandEmpty>
                            <CommandGroup>
                              {TEMPLATES.map((template) => (
                                <CommandItem
                                  value={template.template}
                                  key={template.id}
                                  onSelect={() => {
                                    editAppointmentForm.setValue("attention_type", template.template, { shouldValidate: true });
                                  }}
                                >
                                  {template.template}
                                  <Check className={cn("ml-auto", template.template === field.value ? "opacity-100" : "opacity-0")} />
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
                control={editAppointmentForm.control}
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
                            className={cn("justify-between font-normal pl-3", !field.value && "text-muted-foreground")}
                          >
                            {field.value
                              ? businessUnits?.data.find((businessUnit) => businessUnit.id === field.value)?.name
                              : "Seleccionar sede"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0">
                        <Command>
                          <CommandInput placeholder="Buscar sede" className="h-8" />
                          <CommandList>
                            <CommandEmpty>No se encontraron resultados</CommandEmpty>
                            <CommandGroup>
                              {businessUnits?.data.map((businessUnit) => (
                                <CommandItem
                                  value={businessUnit.id}
                                  key={businessUnit.id}
                                  onSelect={() => {
                                    editAppointmentForm.setValue("clinic_id", businessUnit.id, { shouldValidate: true });
                                  }}
                                >
                                  {businessUnit.name}
                                  <Check className={cn("ml-auto", businessUnit.id === field.value ? "opacity-100" : "opacity-0")} />
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
              control={editAppointmentForm.control}
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
              control={editAppointmentForm.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Escribe tus notas aquí" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={isLoading} size="sm">
                {isLoading && <Loader2Icon className="animate-spin" />}
                Actualizar turno
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

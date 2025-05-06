'use client'

import { AsyncSelect } from "@/components/async-select";
import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAppointmentMutation } from "@/lib/services/appointments";
import { useGetProfileQuery } from "@/lib/services/auth";
import { useLazyListBusinessUnitsQuery } from "@/lib/services/business-units";
import { useLazyListPatientsQuery } from "@/lib/services/patients";
import { useLazyListTemplatesQuery } from "@/lib/services/templates";
import { useLazyListUsersQuery } from "@/lib/services/users";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { ControllerRenderProps, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newAppointmentSchema } from "../schemas/appointments";

export default function NewAppointmentDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const selectedDate = dialogState.payload?.date

  const [createAppointment, { isLoading }] = useCreateAppointmentMutation()

  const { data: userProfile } = useGetProfileQuery()

  const [getPatients] = useLazyListPatientsQuery()
  const [getDoctors] = useLazyListUsersQuery()
  const [getTemplates] = useLazyListTemplatesQuery()
  const [getBusinessUnits] = useLazyListBusinessUnitsQuery()

  const newAppointmentForm = useForm<z.infer<typeof newAppointmentSchema>>({
    resolver: zodResolver(newAppointmentSchema),
    defaultValues: {
      created_by: "",
      status: "SCHEDULED",
      care_type_id: 1,
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
      doctor_id: "",
      patient_id: "",
      clinic_id: "",
      notes: "",
      mode_of_care: "IN_PERSON",
    }
  });

  const onOpenChange = () => {
    closeDialogs()
    newAppointmentForm.reset()
  }

  const handleTimeChange = (type: "hour" | "minute", value: string, field: ControllerRenderProps<z.infer<typeof newAppointmentSchema>>) => {
    const currentValue = newAppointmentForm.getValues(field.name);
    let newDate: Date;

    if (currentValue && !isNaN(new Date(currentValue).getTime())) {
      newDate = new Date(currentValue);
    } else if (startDate) {
      newDate = new Date(startDate);
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

  const handleGetTemplates = async (query?: string) => {
    try {
      const templates = await getTemplates({ name: query }).unwrap()
      return templates.data.map((template) => ({
        label: template.name,
        value: template.id,
      }))
    } catch (error) {
      console.error("Error al obtener plantillas:", error)
      return []
    }
  }

  const handleGetPatients = async (query?: string) => {
    try {
      const patients = await getPatients(/* { name: query } */).unwrap()
      return patients.data.map((patient) => ({
        label: `${patient.first_name} ${patient.first_last_name}`,
        value: patient.id,
      }))
    } catch (error) {
      console.error("Error al obtener pacientes:", error)
      return []
    }
  }

  const handleGetDoctors = async (query?: string) => {
    try {
      const doctors = await getDoctors({ name: query }).unwrap()
      return doctors.data.map((doctor) => ({
        label: `${doctor.first_name} ${doctor.last_name}`,
        value: doctor.id,
      }))
    } catch (error) {
      console.error("Error al obtener doctores:", error)
      return []
    }
  }

  const handleGetBusinessUnits = async () => {
    try {
      const businessUnits = await getBusinessUnits().unwrap()
      return businessUnits.data.map((bu) => ({
        label: bu.name,
        value: bu.id,
      }))
    } catch (error) {
      console.error("Error al obtener unidades de negocio:", error)
      return []
    }
  }

  async function onSubmit(data: z.infer<typeof newAppointmentSchema>) {
    try {
      const response = await createAppointment({
        ...data,
        start_date: format(new Date(data.start_date), "yyyy-MM-dd"),
        end_date: format(new Date(data.end_date), "yyyy-MM-dd"),
        start_time: format(new Date(data.start_time), "HH:mm"),
        end_time: format(new Date(data.end_time), "HH:mm"),
        created_by: userProfile?.data.id ?? "",
      }).unwrap();

      if (response.status === "SUCCESS") {
        onOpenChange()
        toast.custom((t) => <CustomSonner t={t} description="Turno creado correctamente" />)
      }
    } catch {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear el turno" variant="error" />)
    }
  }

  const hours = Array.from({ length: 12 }, (_, i) => i + 7);
  const minutes = [0, 30];

  const startDate = useWatch({ control: newAppointmentForm.control, name: "start_date" });
  const endDate = useWatch({ control: newAppointmentForm.control, name: "end_date" });

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState)
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (selectedDate) {
      newAppointmentForm.setValue("start_date", selectedDate.toISOString())
      if (!selectedDate.getHours()) return
      newAppointmentForm.setValue("start_time", selectedDate.toISOString())
    }
  }, [selectedDate])

  useEffect(() => {
    if (userProfile) {
      newAppointmentForm.setValue("created_by", userProfile.data.id)
    }
  }, [userProfile])

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
            <div className="grid grid-cols-2 gap-4">
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
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <p className="truncate w-full">
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Seleccionar fecha</span>
                              )}
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
                            field.onChange(date?.toISOString())
                            newAppointmentForm.setValue("end_date", "")
                            newAppointmentForm.setValue("end_time", "")
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
                control={newAppointmentForm.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Hora de inicio</FormLabel>
                    <Popover modal>
                      <PopoverTrigger disabled={!startDate} asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "hh:mm a")
                            ) : (
                              <span>Seleccionar hora</span>
                            )}
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

                                let isDisabled: boolean = false
                                if (isSameDay) {
                                  isDisabled = hour < startHour;
                                }
                                return (
                                  <Button
                                    key={hour}
                                    size="icon"
                                    variant={
                                      field.value &&
                                        new Date(field.value).getHours() === hour
                                        ? "default"
                                        : "ghost"
                                    }
                                    className={cn("sm:w-full shrink-0 aspect-square")}
                                    disabled={isDisabled}
                                    onClick={() => {
                                      handleTimeChange("hour", hour.toString(), field)
                                      newAppointmentForm.setValue("end_time", "")
                                    }}
                                  >
                                    {hour < 10 ? `0${hour}` : hour}
                                  </Button>
                                );
                              }
                              )}
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
                                    variant={
                                      field.value &&
                                        new Date(field.value).getMinutes() === minute
                                        ? "default"
                                        : "ghost"
                                    }
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
                control={newAppointmentForm.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Fecha de fin</FormLabel>
                    <Popover modal>
                      <PopoverTrigger disabled={!startDate} asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString())}
                          disabled={(date) => {
                            if (!startDate) return false;
                            const startOnly = new Date(startDate);
                            startOnly.setHours(0, 0, 0, 0);
                            const currentOnly = new Date(date);
                            currentOnly.setHours(0, 0, 0, 0);
                            return currentOnly < startOnly;
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
                control={newAppointmentForm.control}
                name="end_time"
                render={({ field }) => {
                  const endTimeDate =
                    field.value && !isNaN(new Date(field.value).getTime())
                      ? new Date(field.value)
                      : endDate
                        ? new Date(endDate)
                        : new Date(startDate);

                  const startTimeValue = newAppointmentForm.getValues("start_time");
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
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "hh:mm a")
                              ) : (
                                <span>Seleccionar hora</span>
                              )}
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
                                      variant={
                                        field.value &&
                                          new Date(field.value).getHours() === hour
                                          ? "default"
                                          : "ghost"
                                      }
                                      className={cn("sm:w-full shrink-0 aspect-square")}
                                      disabled={isDisabled}
                                      onClick={() =>
                                        !isDisabled &&
                                        handleTimeChange("hour", hour.toString(), field)
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
                                      variant={
                                        field.value &&
                                          new Date(field.value).getMinutes() === minute
                                          ? "default"
                                          : "ghost"
                                      }
                                      className={cn("sm:w-full shrink-0 aspect-square")}
                                      disabled={isDisabled}
                                      onClick={() =>
                                        !isDisabled &&
                                        handleTimeChange("minute", minute.toString(), field)
                                      }
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
                control={newAppointmentForm.control}
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
                control={newAppointmentForm.control}
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
                control={newAppointmentForm.control}
                name="template_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Tipo de atención</FormLabel>
                    <AsyncSelect<{ label: string, value: number }, number>
                      label="Plantilla"
                      triggerClassName="!w-full"
                      placeholder="Seleccionar plantilla"
                      fetcher={handleGetTemplates}
                      getDisplayValue={(item) => item.label}
                      getOptionValue={(item) => item.value}
                      renderOption={(item) => <div>{item.label}</div>}
                      onChange={field.onChange}
                      value={field.value}
                      noResultsMessage="No se encontraron plantillas"
                      modal
                    />
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
                    <AsyncSelect<{ label: string, value: string }, string>
                      label="Sede"
                      triggerClassName="!w-full"
                      placeholder="Seleccionar sede"
                      fetcher={handleGetBusinessUnits}
                      getDisplayValue={(item) => item.label}
                      getOptionValue={(item) => item.value}
                      renderOption={(item) => <div>{item.label}</div>}
                      onChange={field.onChange}
                      value={field.value}
                      noResultsMessage="No se encontraron sedes"
                      modal
                    />
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
                <FormItem className="flex flex-col">
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
                loading={isLoading}
                size="sm"
              >
                Crear turno
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


/* 

    <Dialog
      open={dialogState.open === "new-appointment"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Seleccionar Fecha</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"

                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>

*/
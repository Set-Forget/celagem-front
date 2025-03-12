'use client'

import { NewField, newFieldSchema, NewSection, NewTemplate } from "@/app/(private)/medical-management/scheduler/schemas/templates";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import PropField from "./prop-field";
import { propFieldAdapter } from "../utils";
import { Switch } from "@/components/ui/switch";
import { NormalizedSchema } from "../page";

export const fieldTypes = [
  { label: "Texto", value: "text" },
  { label: "Número", value: "number" },
  { label: "Fecha", value: "date" },
  { label: "Hora", value: "time" },
  { label: "Fecha y hora", value: "datetime" },
  { label: "Archivo", value: "file" },
  { label: "Lista de selección unica", value: "select" },
  { label: "Texto largo", value: "textarea" },
  { label: "Título", value: "title" },
] as const;

export const propertiesByType: Record<
  z.infer<typeof newFieldSchema>["type"]["primitive_type"],
  (keyof z.infer<typeof newFieldSchema>["type"]["properties"])[]
> = {
  text: ["maxLength", "defaultValue"],
  number: ["maxValue", "minValue", "defaultValue"],
  checkbox: [],
  date: ["defaultValue"],
  datetime: ["defaultValue"],
  time: ["defaultValue"],
  file: [],
  select: ["options"],
  textarea: ["maxLength", "defaultValue"],
  title: [],
};

export default function NewFieldDialog() {
  const { getValues, setValue } = useFormContext<NormalizedSchema>();

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const payload = dialogState.payload as {
    sectionId: number
  }

  const form = useForm<z.infer<typeof newFieldSchema>>({
    resolver: zodResolver(newFieldSchema),
  });

  const selectedType = useWatch({ control: form.control, name: "type.primitive_type" });
  const properties = selectedType ? propertiesByType[selectedType] ?? [] : [];

  const onOpenChange = () => {
    closeDialogs()
    form.reset()
  }

  async function onSubmit(data: z.infer<typeof newFieldSchema>) {
    const sectionIndex = getValues("sections").findIndex((section) => section.id === payload.sectionId)
    const currentGlobalFields = getValues("fields") || [];
    const currentSectionFieldIds = getValues(`sections.${sectionIndex}.fields`) || [];

    const newId = currentGlobalFields.length > 0 ? Math.max(...currentGlobalFields.map((field) => field.id)) + 1 : 1;
    const newField = {
      ...data,
      id: newId,
      //esto deberia ser un uuid o algo más (pensar qué)
      code: data.title.toLowerCase().replace(/\s/g, "_"),
    };

    setValue(
      "fields",
      [...currentGlobalFields, newField], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue(
      `sections.${sectionIndex}.fields`,
      [...currentSectionFieldIds, newId],
      { shouldValidate: true, shouldDirty: true }
    );

    closeDialogs();
  }

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState)
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!payload) return
    form.reset({
      section_id: payload.sectionId,
      id: 0,
      code: "",
      title: "",
      rule: null,
      formula: null,
      isActive: true,
      isAlert: false,
      isConditionalField: false,
      isConditionalSection: false,
      isEditable: true,
      isRequired: false,
      isRule: false,
      isValidFormula: false,
      isVisible: false,
      type: {
        primitive_type: undefined,
        properties: {},
      }
    })
  }, [payload])

  return (
    <Dialog
      open={dialogState.open === "new-field"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="w-[500px] max-w-none">
        <DialogHeader>
          <DialogTitle>Nuevo campo</DialogTitle>
          <DialogDescription>
            Crea un nuevo campo para la sección.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="type.primitive_type"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Tipo de campo</FormLabel>
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
                                ? fieldTypes.find(
                                  (fieldType) => fieldType.value === field.value
                                )?.label
                                : "Seleccionar tipo de campo"}
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
                              {fieldTypes.map((fieldType) => (
                                <CommandItem
                                  value={fieldType.value}
                                  key={fieldType.value}
                                  onSelect={() => {
                                    form.setValue("type.primitive_type", fieldType.value);
                                    form.setValue("type.properties", {});
                                  }}
                                >
                                  {fieldType.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      fieldType.value === field.value
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
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Nombre del campo</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Título..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border px-3 h-9 shadow-sm">
                    <FormLabel>¿Es requerido?</FormLabel>
                    <FormControl>
                      <Switch
                        className="!m-0"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {properties.map((propKey) => (
                <FormField
                  key={propKey}
                  control={form.control}
                  name={`type.properties.${propKey}`}
                  render={({ field }) => {
                    const { ref, ...restField } = field;
                    return <FormItem className="flex flex-col w-full">
                      <FormLabel>{propFieldAdapter[propKey as keyof typeof propFieldAdapter]}</FormLabel>
                      <FormControl>
                        <PropField
                          propKey={propKey}
                          field={restField}
                          primitiveType={selectedType}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  }}
                />
              ))}
            </div>
            <DialogFooter>
              <Button
                size="sm"
              >
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
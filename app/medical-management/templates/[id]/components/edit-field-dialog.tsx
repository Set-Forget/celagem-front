"use client";

import { NewField, newFieldSchema, NewSection, NewTemplate, typeSchema } from "@/app/medical-management/scheduler/schemas/templates";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import PropField from "./prop-field";
import { propFieldAdapter } from "../utils";
import { NormalizedSchema } from "../page";
import { fieldTypes, propertiesByType } from "./new-field-dialog";

export default function EditFieldDialog() {
  const { getValues, setValue } = useFormContext<NormalizedSchema>();

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const payload = dialogState.payload as {
    fieldId: number;
  };

  const fieldId = payload?.fieldId;

  const form = useForm<z.infer<typeof newFieldSchema>>({
    resolver: zodResolver(newFieldSchema)
  });

  const selectedType = useWatch({ control: form.control, name: "type.primitive_type" });
  const properties = selectedType ? propertiesByType[selectedType] ?? [] : [];

  const onOpenChange = () => {
    closeDialogs();
    form.reset();
  };

  async function onSubmit(data: z.infer<typeof newFieldSchema>) {
    const currentGlobalFields = getValues("fields") || [];

    const fieldIndex = currentGlobalFields.findIndex((f) => f.id === fieldId);
    if (fieldIndex === -1) return console.warn("Field not found. (Auto-generated error)");

    const updatedField = { ...data, id: fieldId };
    const updatedFields = [...currentGlobalFields];
    updatedFields[fieldIndex] = updatedField;

    setValue("fields", updatedFields, {
      shouldValidate: true,
      shouldDirty: true
    });

    closeDialogs();
  }

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (dialogState.open !== "edit-field") return;

    const fieldsGlobal = getValues("fields") || [];
    const existingField = fieldsGlobal.find((f) => f.id === fieldId);
    if (!existingField) {
      form.reset();
      return;
    }

    const newType = {
      primitive_type: existingField.type.primitive_type,
      properties: existingField.type.properties || {}
    } as z.infer<typeof typeSchema>;

    form.reset({
      ...existingField,
      type: newType
    });
  }, [dialogState.open]);

  return (
    <Dialog
      open={dialogState.open === "edit-field"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="w-[500px] max-w-none">
        <DialogHeader>
          <DialogTitle>Editar campo</DialogTitle>
          <DialogDescription>Modifica un campo existente.</DialogDescription>
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
                                ? fieldTypes.find((ft) => ft.value === field.value)?.label
                                : "Seleccionar tipo de campo"}
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
                              {fieldTypes.map((ft) => (
                                <CommandItem
                                  value={ft.value}
                                  key={ft.value}
                                  onSelect={() => {
                                    form.setValue("type.primitive_type", ft.value);
                                    form.setValue("type.properties", {});
                                  }}
                                >
                                  {ft.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      ft.value === field.value ? "opacity-100" : "opacity-0"
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
                      <Input {...field} placeholder="Título..." />
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
                    return (
                      <FormItem className="flex flex-col w-full">
                        <FormLabel className="font-normal">
                          {propFieldAdapter[propKey as keyof typeof propFieldAdapter]}
                        </FormLabel>
                        <FormControl>
                          <PropField
                            propKey={propKey}
                            field={restField}
                            primitiveType={selectedType}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <DialogFooter>
              <Button size="sm">
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

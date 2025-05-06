"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import { newSectionSchema } from "@/app/(private)/medical-management/calendar/schemas/templates";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { NormalizedSchema } from "../page";

const sectionTypes = [
  { label: "Formulario", value: "form" },
  { label: "Tabla", value: "table" },
] as const;

export default function NewSectionDialog() {
  const { getValues, setValue } = useFormContext<NormalizedSchema>();

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const form = useForm<z.infer<typeof newSectionSchema>>({
    resolver: zodResolver(newSectionSchema),
  });

  const onOpenChange = () => {
    closeDialogs();
    form.reset();
  };

  async function onSubmit(data: z.infer<typeof newSectionSchema>) {
    const currentSections = getValues("sections") || [];

    const newId =
      currentSections.length > 0
        ? Math.max(...currentSections.map((section) => section.id ?? 0)) + 1
        : 1;

    const newSection: z.infer<typeof newSectionSchema> = {
      ...data,
      id: newId
    };

    setValue("sections", [...currentSections, newSection], {
      shouldDirty: true,
      shouldValidate: true,
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
    if (dialogState.open !== "new-section") return;

    form.reset({
      id: 0,
      name: "",
      type: "form",
      description: "",
      isActive: true,
      isForPrintInColumns: false,
      fields: [],
    });
  }, [dialogState.open]);

  return (
    <Dialog open={dialogState.open === "new-section"} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px] max-w-none">
        <DialogHeader>
          <DialogTitle>Nueva sección</DialogTitle>
          <DialogDescription>
            Crea una nueva sección para la plantilla.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nombre de la sección" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="font-normal">Descripción</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Breve descripción" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo de sección" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sectionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button size="sm">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

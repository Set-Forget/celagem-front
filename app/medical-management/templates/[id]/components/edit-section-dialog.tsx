"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  NewTemplate,
  NewSection,
  newSectionSchema
} from "@/app/medical-management/scheduler/schemas/templates";
import {
  DialogsState,
  dialogsStateObservable,
  closeDialogs
} from "@/lib/store/dialogs-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NormalizedSchema } from "../page";

const sectionTypes = [
  { label: "Formulario", value: "form" },
  { label: "Tabla", value: "table" }
] as const;

export default function EditSectionDialog() {
  const { getValues, setValue } = useFormContext<NormalizedSchema>();

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });
  const payload = dialogState.payload as { sectionId?: number };

  const form = useForm<z.infer<typeof newSectionSchema>>({
    resolver: zodResolver(newSectionSchema)
  });

  const onOpenChange = () => {
    closeDialogs();
    form.reset();
  };

  async function onSubmit(data: z.infer<typeof newSectionSchema>) {
    const sectionId = payload?.sectionId;
    if (!sectionId) {
      closeDialogs();
      return;
    }

    const currentSections = getValues("sections") || [];

    const index = currentSections.findIndex((sec) => sec.id === sectionId);
    if (index === -1) {
      closeDialogs();
      return;
    }

    const updatedSection: NewSection = {
      ...data,
      id: sectionId
    };

    const updatedSections = [...currentSections];
    updatedSections[index] = updatedSection;

    setValue("sections", updatedSections, {
      shouldDirty: true,
      shouldValidate: true
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
    if (dialogState.open !== "edit-section") return;

    const sectionId = payload?.sectionId;
    if (!sectionId) {
      form.reset();
      return;
    }

    const sections = getValues("sections") || [];
    const existingSection = sections.find((sec) => sec.id === sectionId);

    if (!existingSection) {
      form.reset();
      return;
    }

    form.reset({
      ...existingSection
    });
  }, [dialogState.open]);

  return (
    <Dialog open={dialogState.open === "edit-section"} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px] max-w-none">
        <DialogHeader>
          <DialogTitle>Editar sección</DialogTitle>
          <DialogDescription>
            Modifica una sección existente de la plantilla.
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
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo de sección" />
                        </SelectTrigger>
                        <SelectContent>
                          {sectionTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
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

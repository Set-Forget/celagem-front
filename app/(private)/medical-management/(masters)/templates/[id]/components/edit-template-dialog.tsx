"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
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
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { newTemplateSchema } from "@/app/(private)/medical-management/(masters)/schemas/templates";
import { useUpdateTemplateMutation } from "@/lib/services/templates";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import { NormalizedSchema } from "../../../schemas/masters";

export default function EditTemplateDialog() {
  const { getValues } = useFormContext<NormalizedSchema>();

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });
  const [updateTemplate, { isLoading: isUpdatingTemplate }] = useUpdateTemplateMutation();

  const form = useForm<z.infer<typeof newTemplateSchema>>({
    resolver: zodResolver(newTemplateSchema),
  });

  const onOpenChange = () => {
    closeDialogs();
    form.reset();
  };

  async function onSubmit(data: z.infer<typeof newTemplateSchema>) {
    try {
      await updateTemplate(data).unwrap();
      closeDialogs();
    } catch (error) {
      console.error("Error actualizando plantilla:", error);
    }
  }

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (dialogState.open !== "edit-template") return;

    const template = getValues("template")
    if (!template) {
      form.reset();
      return;
    }
    form.reset(template);
  }, [dialogState.open, form]);

  return (
    <Dialog open={dialogState.open === "edit-template"} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px] max-w-none">
        <DialogHeader>
          <DialogTitle>Editar plantilla</DialogTitle>
          <DialogDescription>
            Modifica los datos de la plantilla.
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
                      <Input {...field} placeholder="Nombre de la plantilla" />
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
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Descripción de la plantilla" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border px-3 h-9 shadow-sm">
                    <FormLabel>¿Está activa?</FormLabel>
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
            </div>
            <DialogFooter>
              <Button size="sm" disabled={isUpdatingTemplate}>
                {isUpdatingTemplate ? <Loader2 className="animate-spin" /> : null}
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import NewSectionForm from "../../../components/new-section-form";
import { NormalizedSchema } from "../../../schemas/masters";
import { newSectionSchema } from "../../../schemas/templates";

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

    const numericIds = currentSections
      .map(s => Number(s.id))
      .filter(id => Number.isFinite(id));

    const negativeIds = numericIds.filter(id => id < 0);

    const nextId = negativeIds.length > 0
      ? Math.min(...negativeIds) - 1
      : -1;

    const newSection: z.infer<typeof newSectionSchema> = {
      ...data,
      id: nextId
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
      is_active: true,
      is_for_print_in_columns: false,
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
            <NewSectionForm />
            <DialogFooter>
              <Button size="sm">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

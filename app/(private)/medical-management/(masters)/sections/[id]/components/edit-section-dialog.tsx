"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import {
  NewSection,
  newSectionSchema
} from "@/app/(private)/medical-management/(masters)/schemas/templates";
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
  Form
} from "@/components/ui/form";
import {
  closeDialogs,
  DialogsState,
  dialogsStateObservable
} from "@/lib/store/dialogs-store";
import { NormalizedSchema } from "../../../schemas/masters";
import NewSectionForm from "../../../components/new-section-form";
import { useUpdateSectionMutation } from "@/lib/services/templates";
import { useSendMessageMutation } from "@/lib/services/telegram";

export default function EditSectionDialog() {
  const { getValues } = useFormContext<NormalizedSchema>();
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const [sendMessage] = useSendMessageMutation();
  const [updateSection, { isLoading: isUpdatingSection }] = useUpdateSectionMutation();

  const form = useForm<z.infer<typeof newSectionSchema>>({
    resolver: zodResolver(newSectionSchema)
  });

  const onOpenChange = () => {
    closeDialogs();
    form.reset();
  };

  async function onSubmit(data: z.infer<typeof newSectionSchema>) {
    try {
      await updateSection(data).unwrap();
      closeDialogs();
    } catch (error) {
      sendMessage({
        location: "app/(private)/medical-management/(masters)/sections/[id]/components/edit-section-dialog.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      })
    }
  }

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (dialogState.open !== "edit-section") return;

    const section = getValues("section")
    if (!section) {
      form.reset();
      return;
    }
    form.reset(section);
  }, [dialogState.open]);

  return (
    <Dialog
      open={dialogState.open === "edit-section"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="w-[500px] max-w-none">
        <DialogHeader>
          <DialogTitle>Editar sección</DialogTitle>
          <DialogDescription>
            Modifica una sección existente de la plantilla.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <NewSectionForm />
            <DialogFooter>
              <Button
                size="sm"
                loading={isUpdatingSection}
              >
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

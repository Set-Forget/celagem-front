"use client";

import { newFieldSchema, typeSchema } from "@/app/(private)/medical-management/calendar/schemas/templates";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { NormalizedSchema } from "../page";
import NewFieldForm from "./new-field-form";

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
            <NewFieldForm />
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

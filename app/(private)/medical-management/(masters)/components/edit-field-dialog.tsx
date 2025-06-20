"use client";

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
import { NormalizedSchema } from "../schemas/masters";
import NewFieldForm from "./new-field-form";
import { newFieldSchema, typeSchema } from "../schemas/templates";
import { toast } from "sonner";
import CustomSonner from "@/components/custom-sonner";
import { useUpdateFieldMutation } from "@/lib/services/templates";

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

  const [updateField, { isLoading: isUpdatingField }] = useUpdateFieldMutation();

  const onOpenChange = () => {
    closeDialogs();
    form.reset();
  };

  async function onSubmit(data: z.infer<typeof newFieldSchema>) {
    const currentGlobalFields = getValues("fields") || [];

    const fieldIndex = currentGlobalFields.findIndex((f) => f.id === fieldId);
    if (fieldIndex === -1) return console.warn("Field not found. (Auto-generated error)");

    const updatedField = { ...data, id: fieldId } as z.infer<typeof newFieldSchema> & { id: number };

    try {
      await updateField(updatedField).unwrap();

      const updatedFields = [...currentGlobalFields];
      updatedFields[fieldIndex] = { ...updatedField } as any;

      setValue("fields", updatedFields, {
        shouldValidate: true,
        shouldDirty: false,
      });

      toast.custom((t) => (
        <CustomSonner t={t} description="Campo actualizado exitosamente" />
      ));

      closeDialogs();
    } catch (err) {
      toast.custom((t) => (
        <CustomSonner t={t} description="Error actualizando campo" variant="error" />
      ));
    }
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
              <Button size="sm" loading={isUpdatingField}>
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

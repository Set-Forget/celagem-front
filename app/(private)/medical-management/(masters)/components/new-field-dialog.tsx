"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { NormalizedSchema } from "../schemas/masters";
import NewFieldForm from "./new-field-form";
import { newFieldSchema } from "../schemas/templates";
import { toast } from "sonner";
import { useCreateFieldMutation, useUpdateSectionMutation, useUpdateFieldMutation } from "@/lib/services/templates";
import CustomSonner from "@/components/custom-sonner";
import { v4 as uuidv4 } from "uuid";

export default function NewFieldDialog() {
  const { getValues, setValue } = useFormContext<NormalizedSchema>();

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const payload = dialogState.payload as {
    sectionId: number
  }

  const form = useForm<z.infer<typeof newFieldSchema>>({
    resolver: zodResolver(newFieldSchema),
  });

  const [createField, { isLoading: isCreatingField }] = useCreateFieldMutation();
  const [updateSection, { isLoading: isUpdatingSection }] = useUpdateSectionMutation();
  const [updateField, { isLoading: isUpdatingField }] = useUpdateFieldMutation();

  const onOpenChange = () => {
    closeDialogs()
    form.reset()
  }

  async function onSubmit(data: z.infer<typeof newFieldSchema>) {
    try {
      const currentFields = getValues("fields") || [];
      const sectionData = getValues("section");

      const fieldToSend: z.infer<typeof newFieldSchema> = {
        ...data,
        code: data.code || uuidv4(),
      };

      const response = await createField(fieldToSend).unwrap();
      const createdFieldResponse = response.data;

      const createdFieldFull: z.infer<typeof newFieldSchema> = {
        ...fieldToSend,
        id: createdFieldResponse.id,
        order: 0,
      };

      const shiftedExistingFields = currentFields.map((f) => ({ ...f, order: (f.order ?? 0) + 1 }));

      const updatedSectionFields = [createdFieldResponse.id, ...sectionData.fields];

      await updateSection({ ...sectionData, id: sectionData.id, fields: updatedSectionFields });

      const updatePromises: Promise<unknown>[] = [];

      updatePromises.push(updateField({ ...createdFieldFull, id: createdFieldResponse.id }).unwrap());

      shiftedExistingFields.forEach((field) => {
        updatePromises.push(updateField({ ...field, id: field.id, order: field.order }).unwrap());
      });

      await Promise.all(updatePromises);

      toast.custom((t) => (
        <CustomSonner t={t} description="Campo creado exitosamente" />
      ));

      closeDialogs();
    } catch (err) {
      toast.custom((t) => (
        <CustomSonner t={t} description="Error creando campo" variant="error" />
      ));
    }
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
      code: uuidv4(),
      title: "",
      rule: null,
      formula: null,
      is_active: true,
      is_alert: false,
      is_conditional_field: false,
      is_conditional_section: false,
      is_editable: true,
      is_required: false,
      is_rule: false,
      is_valid_formula: false,
      is_visible: false,
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
            <NewFieldForm />
            <DialogFooter>
              <Button
                size="sm"
                loading={isCreatingField || isUpdatingSection || isUpdatingField}
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
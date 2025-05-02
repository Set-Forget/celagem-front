"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { z } from "zod";
import { NormalizedSchema } from "../schemas/masters";
import NewFieldForm from "./new-field-form";
import { newFieldSchema } from "../schemas/templates";

export default function NewFieldDialog() {
  const { getValues, setValue } = useFormContext<NormalizedSchema>();

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const payload = dialogState.payload as {
    sectionId: number
  }

  const form = useForm<z.infer<typeof newFieldSchema>>({
    resolver: zodResolver(newFieldSchema),
  });

  const onOpenChange = () => {
    closeDialogs()
    form.reset()
  }

  async function onSubmit(data: z.infer<typeof newFieldSchema>) {
    const currentFields = getValues("fields") || [];

    const numericIds = currentFields
      .map(f => Number(f.id))
      .filter(id => Number.isFinite(id));

    const negativeIds = numericIds.filter(id => id < 0);

    const nextId = negativeIds.length > 0
      ? Math.min(...negativeIds) - 1
      : -1;

    const newField = {
      ...data,
      id: nextId,
      code: uuidv4(),
    };

    setValue("fields", [...currentFields, newField], {
      shouldValidate: true,
      shouldDirty: true,
    });

    // @ Se usa kind para determinar si es una plantilla o una sección.
    // @ Encontré esta forma de hacerlo, pero no estoy seguro si es la mejor.
    // @ Es necesaria para determinar como setear los valores de los campos.
    if (getValues("kind") === "template") {
      const idx = getValues("sections")
        .findIndex(section => section.id === payload.sectionId);

      setValue(
        `sections.${idx}.fields`,
        [...(getValues(`sections.${idx}.fields`) ?? []), nextId],
        { shouldValidate: true, shouldDirty: true },
      );
    } else {
      setValue(
        "section.fields",
        [...getValues("section.fields"), nextId],
        { shouldValidate: true, shouldDirty: true },
      );
    }

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
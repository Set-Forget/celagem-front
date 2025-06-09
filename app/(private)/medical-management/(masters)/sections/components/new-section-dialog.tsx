"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { newSectionSchema } from "@/app/(private)/medical-management/(masters)/schemas/templates";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreateSectionMutation } from "@/lib/services/templates";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { useRouter } from "next/navigation";
import NewSectionForm from "../../components/new-section-form";
import { toast } from "sonner";
import CustomSonner from "@/components/custom-sonner";
import { useSendMessageMutation } from "@/lib/services/telegram";

export default function NewSectionDialog() {
  const router = useRouter();

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const [sendMessage] = useSendMessageMutation();
  const [createSection, { isLoading: isCreatingSection }] = useCreateSectionMutation()

  const form = useForm<z.infer<typeof newSectionSchema>>({
    resolver: zodResolver(newSectionSchema),
    defaultValues: {
      id: 0,
      name: "",
      type: "form",
      description: "",
      is_active: true,
      is_for_print_in_columns: false,
      fields: [],
    },
  });

  const onOpenChange = () => {
    closeDialogs();
    form.reset();
  };

  async function onSubmit(data: z.infer<typeof newSectionSchema>) {
    try {
      const template = await createSection(data).unwrap();

      if (template.status === "SUCCESS") {
        toast.custom((t) => <CustomSonner t={t} description="Sección creada exitosamente" />)
      }

      router.push(`/medical-management/sections/${template.data.id}`);

      closeDialogs();
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error creando sección" variant="error" />)
      sendMessage({
        location: "app/(private)/medical-management/(masters)/sections/components/new-section-dialog.tsx",
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

  return (
    <Dialog open={dialogState.open === "new-section"} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px] max-w-none">
        <DialogHeader>
          <DialogTitle>Nueva sección</DialogTitle>
          <DialogDescription>
            Crea una nueva sección, luego podrás agregar campos o vincularla a una plantilla.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <NewSectionForm />
            <DialogFooter>
              <Button
                loading={isCreatingSection}
                size="sm"
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

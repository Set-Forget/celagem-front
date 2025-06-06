"use client";

import { newTemplateSchema } from "@/app/(private)/medical-management/(masters)/schemas/templates";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { useCreateTemplateMutation } from "@/lib/services/templates";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomSonner from "@/components/custom-sonner";
import { toast } from "sonner";
import { useSendMessageMutation } from "@/lib/services/telegram";

export default function NewTemplateDialog() {
  const router = useRouter();

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const [sendMessage] = useSendMessageMutation();
  const [createTemplate, { isLoading: isCreatingTemplate }] = useCreateTemplateMutation()

  const form = useForm<z.infer<typeof newTemplateSchema>>({
    resolver: zodResolver(newTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
      sections: [],
      layout: "tab",
      type: "template",
      is_active: true,
      is_epicrisis: false,
      is_for_send_email_to_insurance_provider: false,
      is_for_print_independently: false,
      is_for_print_with_all_the_templates: false,
      is_for_send_order_to_appointment_box: false
    },
  });

  const onOpenChange = () => {
    closeDialogs();
    form.reset();
  };

  async function onSubmit(data: z.infer<typeof newTemplateSchema>) {
    try {
      const template = await createTemplate(data).unwrap();

      if (template.status === "SUCCESS") {
        toast.custom((t) => <CustomSonner t={t} description="Plantilla creada exitosamente" />)
      }

      router.push(`/medical-management/templates/${template.data.id}`);

      closeDialogs();
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error creando plantilla" variant="error" />)
      sendMessage({
        location: "app/(private)/medical-management/(masters)/templates/components/new-template-dialog.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      }).unwrap().catch((error) => {
        console.error(error);
      });
    }
  }

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Dialog open={dialogState.open === "new-template"} onOpenChange={onOpenChange}>
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
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Breve descripción..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                size="sm"
                disabled={isCreatingTemplate}
              >
                {isCreatingTemplate && <Loader2 className="animate-spin" />}
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
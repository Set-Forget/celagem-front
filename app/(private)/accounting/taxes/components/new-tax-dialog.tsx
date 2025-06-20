import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreateTaxMutation } from "@/lib/services/taxes";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newTaxSchema } from "../schema/taxes";
import NewTaxForm from "./new-tax-form";

export default function NewTaxDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const [sendMessage] = useSendMessageMutation();
  const [createTax, { isLoading: isCreatingTax }] = useCreateTaxMutation();

  const form = useForm<z.infer<typeof newTaxSchema>>({
    resolver: zodResolver(newTaxSchema),
    defaultValues: {
      name: '',
    },
  });

  const onOpenChange = () => {
    closeDialogs()
    form.reset()
  }

  const onSubmit = async (data: z.infer<typeof newTaxSchema>) => {
    try {
      const response = await createTax({
        ...data,
        company: 1,
        sequence: 1,
        tax_group: 1,
        amount_type: 'percent'
      }).unwrap();

      if (response.status === 'success') {
        onOpenChange()
        toast.custom((t) => <CustomSonner t={t} description="Impuesto creado exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al crear impuesto" variant="error" />);
      sendMessage({
        location: "app/(private)/accounting/taxes/(form)/components/new-tax-dialog.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      })
    }
  };

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState)
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Dialog
      open={dialogState.open === "new-tax"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nuevo impuesto</DialogTitle>
          <DialogDescription>
            Crea un nuevo impuesto para tu compañía.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <NewTaxForm />
          <DialogFooter>
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              size="sm"
              loading={isCreatingTax}
              type="button">
              Crear
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
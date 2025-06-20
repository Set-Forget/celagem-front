import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreatePaymentTermMutation } from "@/lib/services/payment-terms";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newPaymentTermSchema } from "../schema/payment-terms";
import NewPaymentTermForm from "./new-payment-term-form";

export default function NewPaymentTermDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const [sendMessage] = useSendMessageMutation();
  const [createPaymentTerm, { isLoading: isCreatingPaymentTerm }] = useCreatePaymentTermMutation();

  const form = useForm<z.infer<typeof newPaymentTermSchema>>({
    resolver: zodResolver(newPaymentTermSchema),
    defaultValues: {
      name: '',
    },
  });

  const onOpenChange = () => {
    closeDialogs()
    form.reset()
  }

  const onSubmit = async (data: z.infer<typeof newPaymentTermSchema>) => {
    try {
      const response = await createPaymentTerm({
        ...data,
        sequence: 10,
        items: data.items.map((item) => ({
          ...item,
          value: 'percent',
          value_amount: 100,
        })),
      }).unwrap();

      if (response.status === 'success') {
        onOpenChange()
        toast.custom((t) => <CustomSonner t={t} description="Término de pago creado exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al crear término de pago" variant="error" />);
      sendMessage({
        location: "app/(private)/accounting/payment-terms/(form)/components/new-payment-term-dialog.tsx",
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
      open={dialogState.open === "new-payment-term"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nuevo término de pago</DialogTitle>
          <DialogDescription>
            Crea un nuevo término de pago para tu compañía.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <NewPaymentTermForm />
          <DialogFooter>
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              size="sm"
              loading={isCreatingPaymentTerm}
              type="button">
              Crear
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreatePaymentMethodLineMutation, useCreatePaymentMethodMutation } from "@/lib/services/payment-methods";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newPaymentMethodSchema } from "../schema/payment-methods";
import NewPaymentMethodForm from "./new-payment-method-form";
import { v4 as uuidv4 } from 'uuid';

export default function NewPaymentMethodDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const [sendMessage] = useSendMessageMutation();
  const [createPaymentMethod, { isLoading: isCreatingPaymentMethod }] = useCreatePaymentMethodMutation();
  const [createPaymentMethodLine, { isLoading: isCreatingPaymentMethodLine }] = useCreatePaymentMethodLineMutation();

  const form = useForm<z.infer<typeof newPaymentMethodSchema>>({
    resolver: zodResolver(newPaymentMethodSchema),
    defaultValues: {
      name: '',
      company: 1,
    },
  });

  const onOpenChange = () => {
    closeDialogs()
    form.reset()
  }

  const onSubmit = async (data: z.infer<typeof newPaymentMethodSchema>) => {
    const { company, payment_account, ...rest } = data

    try {
      const response = await createPaymentMethod({
        ...rest,
        code: uuidv4()
      }).unwrap();

      const paymentMethodId = response.data.id

      await createPaymentMethodLine({
        payment_method: paymentMethodId,
        company: 1,
        payment_account: payment_account
      }).unwrap();

      if (response.status === 'success') {
        onOpenChange()
        toast.custom((t) => <CustomSonner t={t} description="Método de pago creado exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al crear método de pago" variant="error" />);
      sendMessage({
        location: "app/(private)/accounting/payment-methods/(form)/components/new-payment-method-dialog.tsx",
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
      open={dialogState.open === "new-payment-method"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nuevo método de pago</DialogTitle>
          <DialogDescription>
            Crea un nuevo método de pago para tu compañía.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <NewPaymentMethodForm />
          <DialogFooter>
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              size="sm"
              loading={isCreatingPaymentMethod || isCreatingPaymentMethodLine}
              type="button">
              Crear
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
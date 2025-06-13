import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useGetTaxQuery, useUpdateTaxMutation } from "@/lib/services/taxes";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import NewPaymentMethodForm from "./new-payment-method-form";
import { useGetPaymentMethodQuery, useUpdatePaymentMethodMutation } from "@/lib/services/payment-methods";
import { newPaymentMethodSchema } from "../schema/payment-methods";

export default function EditPaymentMethodDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const paymentMethodId = dialogState?.payload?.payment_method_id as string

  const { data: paymentMethod } = useGetPaymentMethodQuery(paymentMethodId, {
    skip: !paymentMethodId
  })

  const [sendMessage] = useSendMessageMutation();
  const [updatePaymentMethod, { isLoading: isUpdatingPaymentMethod }] = useUpdatePaymentMethodMutation();

  const form = useForm<z.infer<typeof newPaymentMethodSchema>>({
    resolver: zodResolver(newPaymentMethodSchema),
  });

  const onOpenChange = () => {
    closeDialogs()
    form.reset()
  }

  const onSubmit = async (data: z.infer<typeof newPaymentMethodSchema>) => {
    try {
      const response = await updatePaymentMethod({
        id: paymentMethodId,
        body: data,
      }).unwrap();

      if (response.status === 'success') {
        onOpenChange()
        toast.custom((t) => <CustomSonner t={t} description="Método de pago actualizado exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al actualizar método de pago" variant="error" />);
      sendMessage({
        location: "app/(private)/accounting/taxes/(form)/components/edit-tax-dialog.tsx",
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

  useEffect(() => {
    if (paymentMethod) {
      form.reset({
        name: paymentMethod.name,
        payment_type: paymentMethod.payment_type,
      })
    }
  }, [paymentMethod])

  return (
    <Dialog
      open={dialogState.open === "edit-payment-method"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar método de pago</DialogTitle>
          <DialogDescription>
            Edita los datos del método de pago.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <NewPaymentMethodForm />
          <DialogFooter>
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              size="sm"
              loading={isUpdatingPaymentMethod}
              type="button">
              Guardar
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
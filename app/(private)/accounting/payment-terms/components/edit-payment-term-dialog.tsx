import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useGetPaymentTermQuery, useUpdatePaymentTermMutation } from "@/lib/services/payment-terms";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newPaymentTermSchema } from "../schema/payment-terms";
import NewPaymentTermForm from "./new-payment-term-form";

export default function EditPaymentTermDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const paymentTermId = dialogState?.payload?.payment_term_id as string

  const { data: paymentTerm } = useGetPaymentTermQuery(paymentTermId, {
    skip: !paymentTermId
  })

  const [sendMessage] = useSendMessageMutation();
  const [updatePaymentTerm, { isLoading: isUpdatingPaymentTerm }] = useUpdatePaymentTermMutation();

  const form = useForm<z.infer<typeof newPaymentTermSchema>>({
    resolver: zodResolver(newPaymentTermSchema),
  });

  const onOpenChange = () => {
    closeDialogs()
    form.reset()
  }

  const onSubmit = async (data: z.infer<typeof newPaymentTermSchema>) => {
    try {
      const response = await updatePaymentTerm({
        id: paymentTermId,
        body: data,
      }).unwrap();

      if (response.status === 'success') {
        onOpenChange()
        toast.custom((t) => <CustomSonner t={t} description="Término de pago actualizado exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al actualizar término de pago" variant="error" />);
      sendMessage({
        location: "app/(private)/accounting/payment-terms/(form)/components/edit-payment-term-dialog.tsx",
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
    if (paymentTerm) {
      form.reset({
        name: paymentTerm.name,
        items: paymentTerm.items.map((item) => ({
          nb_days: item.nb_days,
          delay_type: item.delay_type,
          value: 'percent',
          value_amount: item.value_amount,
        })),
      })
    }
  }, [paymentTerm])

  return (
    <Dialog
      open={dialogState.open === "edit-payment-term"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar término de pago</DialogTitle>
          <DialogDescription>
            Edita los datos del término de pago.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <NewPaymentTermForm />
          <DialogFooter>
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              size="sm"
              loading={isUpdatingPaymentTerm}
              type="button">
              Guardar
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
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
import { newTaxSchema } from "../schema/taxes";
import NewTaxForm from "./new-payment-term-form";

export default function EditTaxDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const taxId = dialogState?.payload?.tax_id as string

  const { data: tax } = useGetTaxQuery(taxId, {
    skip: !taxId
  })

  const [sendMessage] = useSendMessageMutation();
  const [updateTax, { isLoading: isUpdatingTax }] = useUpdateTaxMutation();

  const form = useForm<z.infer<typeof newTaxSchema>>({
    resolver: zodResolver(newTaxSchema),
  });

  const onOpenChange = () => {
    closeDialogs()
    form.reset()
  }

  const onSubmit = async (data: z.infer<typeof newTaxSchema>) => {
    try {
      const response = await updateTax({
        id: taxId,
        body: data,
      }).unwrap();

      if (response.status === 'success') {
        onOpenChange()
        toast.custom((t) => <CustomSonner t={t} description="Impuesto actualizado exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al actualizar impuesto" variant="error" />);
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
    if (tax) {
      form.reset({
        name: tax.name,
        amount: tax.amount,
        type_tax_use: tax.type_tax_use,
        tax_kind: tax.tax_kind,
      })
    }
  }, [tax])

  return (
    <Dialog
      open={dialogState.open === "edit-tax"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar moneda</DialogTitle>
          <DialogDescription>
            Edita los datos de la moneda.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <NewTaxForm />
          <DialogFooter>
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              size="sm"
              loading={isUpdatingTax}
              type="button">
              Guardar
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
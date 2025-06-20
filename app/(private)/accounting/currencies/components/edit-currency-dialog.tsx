import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useGetCurrencyQuery, useUpdateCurrencyMutation, useUpdateCurrencyRateMutation } from "@/lib/services/currencies";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newCurrencySchema } from "../schema/currencies";
import NewCurrencyForm from "./new-currency-form";

export default function EditCurrencyDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const currencyId = dialogState?.payload?.currency_id as string

  const { data: currency } = useGetCurrencyQuery(currencyId, {
    skip: !currencyId
  })

  const [sendMessage] = useSendMessageMutation();
  const [updateCurrency, { isLoading: isUpdatingCurrency }] = useUpdateCurrencyMutation();
  const [updateCurrencyRate, { isLoading: isUpdatingCurrencyRate }] = useUpdateCurrencyRateMutation();

  const form = useForm<z.infer<typeof newCurrencySchema>>({
    resolver: zodResolver(newCurrencySchema),
  });

  const onOpenChange = () => {
    closeDialogs()
    form.reset()
  }

  const onSubmit = async (data: z.infer<typeof newCurrencySchema>) => {
    const { rate, ...rest } = data

    try {
      const response = await updateCurrency({
        id: currencyId,
        body: rest,
      }).unwrap();

      await updateCurrencyRate({
        id: currencyId,
        body: {
          rate,
          date: new Date().toISOString(),
        },
      }).unwrap();

      if (response.status === 'success') {
        onOpenChange()
        toast.custom((t) => <CustomSonner t={t} description="Moneda actualizada exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al actualizar moneda" variant="error" />);
      sendMessage({
        location: "app/(private)/accounting/currencies/(form)/components/edit-currency-dialog.tsx",
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
    if (currency) {
      form.reset({
        name: currency.name,
        symbol: currency.symbol,
        rate: currency.rate,
        position: currency.position as "before" | "after",
      })
    }
  }, [currency])

  return (
    <Dialog
      open={dialogState.open === "edit-currency"}
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
          <NewCurrencyForm />
          <DialogFooter>
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              size="sm"
              loading={isUpdatingCurrency || isUpdatingCurrencyRate}
              type="button">
              Guardar
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
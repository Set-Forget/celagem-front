import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { useCreateUserMutation } from "@/lib/services/users";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newCurrencySchema } from "../schema/currencies";
import { useCreateCurrencyMutation } from "@/lib/services/currencies";
import NewCurrencyForm from "./new-currency-form";

export default function NewCurrencyDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const [sendMessage] = useSendMessageMutation();
  const [createCurrency, { isLoading: isCreatingCurrency }] = useCreateCurrencyMutation();

  const form = useForm<z.infer<typeof newCurrencySchema>>({
    resolver: zodResolver(newCurrencySchema),
    defaultValues: {
      name: '',
      symbol: '',
      position: 'before',
    },
  });

  const onOpenChange = () => {
    closeDialogs()
    form.reset()
  }

  const onSubmit = async (data: z.infer<typeof newCurrencySchema>) => {
    try {
      const response = await createCurrency(data).unwrap();

      if (response.status === 'success') {
        onOpenChange()
        toast.custom((t) => <CustomSonner t={t} description="Moneda creada exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al crear moneda" variant="error" />);
      sendMessage({
        location: "app/(private)/accounting/currencies/(form)/components/new-currency-dialog.tsx",
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
      open={dialogState.open === "new-currency"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nueva moneda</DialogTitle>
          <DialogDescription>
            Crea una nueva moneda para tu compañía.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <NewCurrencyForm />
          <DialogFooter>
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              size="sm"
              loading={isCreatingCurrency}
              type="button">
              Crear
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
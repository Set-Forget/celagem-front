'use client'

import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreateAccountingAccountMutation } from "@/lib/services/accounting-accounts";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newAccountSchema } from "../schemas/account";
import NewAccountForm from "./new-account-form";

export default function NewAccountDialog() {
  const router = useRouter()

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const [createAccount, { isLoading: isCreatingAccount }] = useCreateAccountingAccountMutation()

  const newAccountForm = useForm<z.infer<typeof newAccountSchema>>({
    resolver: zodResolver(newAccountSchema),
    defaultValues: {
      name: "",
      code: "",
    }
  });

  const onOpenChange = () => {
    closeDialogs()
    newAccountForm.reset()
  }

  const onSubmit = async (data: z.infer<typeof newAccountSchema>) => {
    try {
      const response = await createAccount({
        ...data,
        company: 1, // ! Esto debería ser el id de la compañía pero necesito que Ciro acomode el endpoint para que reciba string.
      }).unwrap()

      if (response.status === "success") {
        closeDialogs()

        toast.custom((t) => <CustomSonner t={t} description="Cuenta contable creada correctamente" variant="success" />)
        router.push(`/accounting/chart-of-accounts/${response.data.id}`)
        newAccountForm.reset()
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la cuenta contable" variant="error" />)
    }
  }

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState)
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Dialog
      open={dialogState.open === "new-account"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            Nueva cuenta contable
          </DialogTitle>
          <DialogDescription>
            Crea una nueva cuenta contable para el sistema de contabilidad.
          </DialogDescription>
        </DialogHeader>
        <Form {...newAccountForm}>
          <NewAccountForm />
        </Form>
        <DialogFooter>
          <Button
            onClick={() => newAccountForm.handleSubmit(onSubmit)()}
            size="sm"
            loading={isCreatingAccount}
            type="button">
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

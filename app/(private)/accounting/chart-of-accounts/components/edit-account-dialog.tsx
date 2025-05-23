'use client'

import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useGetAccountingAccountQuery, useUpdateAccountingAccountMutation } from "@/lib/services/accounting-accounts";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newAccountSchema } from "../schemas/account";
import NewAccountForm from "./new-account-form";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EditAccountDialog() {
  const router = useRouter()

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const id = dialogState?.payload?.id

  const { data: account } = useGetAccountingAccountQuery(id, {
    skip: !dialogState.open || dialogState.open !== "edit-account",
  })

  const [updateAccount, { isLoading: isUpdatingAccount }] = useUpdateAccountingAccountMutation()

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
      const response = await updateAccount({
        body: {
          ...data,
          company: 1, // ! Esto debería ser el id de la compañía pero necesito que Ciro acomode el endpoint para que reciba string.
        },
        id
      }).unwrap()

      if (response.status === "success") {
        closeDialogs()

        toast.custom((t) => <CustomSonner t={t} description="Cuenta contable actualizada correctamente" variant="success" />)
        router.push(`/accounting/chart-of-accounts/${id}`)
        newAccountForm.reset()
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar la cuenta contable" variant="error" />)
    }
  }

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState)
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (account) {
      newAccountForm.reset({
        name: account?.name,
        code: account?.code,
        account_type: account?.account_type,
        parent: account.parent?.id,
      })
    }
  }, [account])

  return (
    <Dialog
      open={dialogState.open === "edit-account"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            Editar cuenta contable
          </DialogTitle>
          <DialogDescription>
            Edita una cuenta contable existente en el sistema de contabilidad.
          </DialogDescription>
        </DialogHeader>
        <Form {...newAccountForm}>
          <NewAccountForm />
        </Form>
        <DialogFooter>
          <Button
            onClick={() => newAccountForm.handleSubmit(onSubmit)()}
            size="sm"
            loading={isUpdatingAccount}
            type="button"
          >
            <Save className={cn(isUpdatingAccount && "hidden")} />
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

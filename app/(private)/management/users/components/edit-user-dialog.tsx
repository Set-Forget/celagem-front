import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { useGetUserQuery, useUpdateUserMutation } from "@/lib/services/users";
import { setDialogsState as _setDialogsState, closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { userBaseSchema, editUserSchema } from "../schema/users";
import NewUserForm from "./new-user-form";

export default function EditUserDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const userId = dialogState?.payload?.user_id as string

  const { data: user } = useGetUserQuery(userId, {
    skip: !userId
  })

  const [sendMessage] = useSendMessageMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();

  const form = useForm<Partial<z.infer<typeof userBaseSchema>>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      role_id: '',
      company_id: '',
      business_units: [],
    },
  });

  const onOpenChange = () => {
    closeDialogs()
    form.reset()
  }

  const onSubmit = async (data: Partial<z.infer<typeof userBaseSchema>>) => {
    try {
      const response = await updateUser({
        id: userId,
        body: data,
      }).unwrap();

      if (response.status === 'success') {
        _setDialogsState({ open: "user-details", payload: { user_id: userId } })
        toast.custom((t) => <CustomSonner t={t} description="Usuario actualizado exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al actualizar usuario" variant="error" />);
      sendMessage({
        location: "app/(private)/management/users/components/edit-user-dialog.tsx",
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
    if (!user) return;

    form.reset({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role_id: user.role.id,
      company_id: user.company.id,
      business_units: user.business_units.map((bu) => bu.id),
      role_is_medical: user.role.is_medical,
      speciality_id: user.speciality.id,
      signature: user.signature,
    })
  }, [user])

  return (
    <Dialog
      open={dialogState.open === "edit-user"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>
            Edita los datos del usuario.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <NewUserForm isEditing />
          <DialogFooter>
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              size="sm"
              loading={isUpdatingUser}
              type="button">
              Guardar
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
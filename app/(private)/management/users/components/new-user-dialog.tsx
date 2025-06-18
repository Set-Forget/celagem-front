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
import { newUserSchema } from "../schema/users";
import NewUserForm from "./new-user-form";
import { useCreateDoctorMutation } from "@/lib/services/doctors";

export default function NewUserDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const [sendMessage] = useSendMessageMutation();
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [createDoctor, { isLoading: isCreatingDoctor }] = useCreateDoctorMutation();

  const form = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      role_id: '',
      role_is_medical: false,
      speciality_id: '',
      signature: '',
      company_id: '',
      password: '',
      business_units: [],
    },
  });

  const onOpenChange = () => {
    closeDialogs()
    form.reset()
  }

  const onSubmit = async (data: Partial<z.infer<typeof newUserSchema>>) => {
    const { signature, speciality_id, role_is_medical, ...rest } = data;

    try {
      const response = await createUser(rest).unwrap();

      if (role_is_medical) {
        const userId = response.data.id
        await createDoctor({
          id: userId,
          signature: data.first_name + ' ' + data.last_name,
          speciality_id: Number(speciality_id),
          image: signature?.split(',')[1] || '',
        }).unwrap();
      }

      if (response.status === 'success') {
        onOpenChange()
        toast.custom((t) => <CustomSonner t={t} description="Usuario creado exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al crear usuario" variant="error" />);
      sendMessage({
        location: "app/(private)/management/users/(form)/components/new-user-dialog.tsx",
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
      open={dialogState.open === "new-user"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nuevo usuario</DialogTitle>
          <DialogDescription>
            Crea un nuevo usuario para tu compañía.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <NewUserForm />
          <DialogFooter>
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              size="sm"
              loading={isCreatingUser || isCreatingDoctor}
              type="button">
              Crear
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
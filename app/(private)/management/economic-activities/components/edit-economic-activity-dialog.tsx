import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useGetEconomicActivityQuery, useUpdateEconomicActivityMutation } from "@/lib/services/economic_activities";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newEconomicActivitySchema } from "../schema/economic-activities";
import NewUserForm from "./new-economic-activity-form";

export default function EditEconomicActivityDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const economicActivityId = dialogState?.payload?.economic_activity_id as string

  const { data: economicActivity } = useGetEconomicActivityQuery(economicActivityId, {
    skip: !economicActivityId
  })

  const [sendMessage] = useSendMessageMutation();
  const [updateEconomicActivity, { isLoading: isUpdatingEconomicActivity }] = useUpdateEconomicActivityMutation();

  const form = useForm<z.infer<typeof newEconomicActivitySchema>>({
    resolver: zodResolver(newEconomicActivitySchema),
  });

  const onOpenChange = () => {
    closeDialogs()
    form.reset()
  }

  const onSubmit = async (data: Partial<z.infer<typeof newEconomicActivitySchema>>) => {
    try {
      const response = await updateEconomicActivity({
        id: economicActivityId,
        body: data,
      }).unwrap();

      if (response.status === 'success') {
        onOpenChange()
        toast.custom((t) => <CustomSonner t={t} description="Actividad económica actualizada exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al actualizar actividad económica" variant="error" />);
      sendMessage({
        location: "app/(private)/management/economic-activities/(form)/components/edit-economic-activity-dialog.tsx",
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
    if (economicActivity) {
      form.reset({
        name: economicActivity.name,
        code: economicActivity.code,
      })
    }
  }, [economicActivity])

  return (
    <Dialog
      open={dialogState.open === "edit-economic-activity"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar actividad económica</DialogTitle>
          <DialogDescription>
            Edita los datos de la actividad económica.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <NewUserForm isEditing />
          <DialogFooter>
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              size="sm"
              loading={isUpdatingEconomicActivity}
              type="button">
              Guardar
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreateEconomicActivityMutation } from "@/lib/services/economic_activities";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newEconomicActivitySchema } from "../schema/economic-activities";
import NewEconomicActivityForm from "./new-economic-activity-form";

export default function NewEconomicActivityDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const [sendMessage] = useSendMessageMutation();
  const [createEconomicActivity, { isLoading: isCreatingEconomicActivity }] = useCreateEconomicActivityMutation();

  const form = useForm<z.infer<typeof newEconomicActivitySchema>>({
    resolver: zodResolver(newEconomicActivitySchema),
    defaultValues: {
      name: '',
      code: ''
    },
  });

  const onOpenChange = () => {
    closeDialogs()
    form.reset()
  }

  const onSubmit = async (data: z.infer<typeof newEconomicActivitySchema>) => {
    try {
      const response = await createEconomicActivity(data).unwrap();

      if (response.status === 'success') {
        onOpenChange()
        toast.custom((t) => <CustomSonner t={t} description="Actividad económica creada exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al crear actividad económica" variant="error" />);
      sendMessage({
        location: "app/(private)/management/economic-activities/(form)/components/new-economic-activity-dialog.tsx",
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
      open={dialogState.open === "new-economic-activity"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nueva actividad económica</DialogTitle>
          <DialogDescription>
            Crea una nueva actividad económica.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <NewEconomicActivityForm />
          <DialogFooter>
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              size="sm"
              loading={isCreatingEconomicActivity}
              type="button">
              Crear
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
'use client'

import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateCostCenterMutation } from "@/lib/services/cost-centers";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newCostCenterSchema } from "../schemas/cost-centers";

export default function NewCostCenterDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const [createCostCenter, { isLoading: isCreatingCostCenter }] = useCreateCostCenterMutation()

  const newCostCenterForm = useForm<z.infer<typeof newCostCenterSchema>>({
    resolver: zodResolver(newCostCenterSchema),
    defaultValues: {
      name: "",
      code: "",
    }
  });

  const onOpenChange = () => {
    closeDialogs()
    newCostCenterForm.reset()
  }

  const onSubmit = async (data: z.infer<typeof newCostCenterSchema>) => {
    try {
      const response = await createCostCenter(data).unwrap()

      if (response.status === "success") {
        closeDialogs()

        toast.custom((t) => <CustomSonner t={t} description="Centro de costos creado correctamente" variant="success" />)
        newCostCenterForm.reset()
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear el centro de costos" variant="error" />)
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
      open={dialogState.open === "new-cost-center"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo centro de costos</DialogTitle>
          <DialogDescription>
            Crea un nuevo centro de costos para asignar a tus transacciones.
          </DialogDescription>
        </DialogHeader>
        <Form {...newCostCenterForm}>
          <form className="gap-4 grid grid-cols-2">
            <FormField
              control={newCostCenterForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Centro de costos principal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newCostCenterForm.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="CC-001"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            onClick={() => newCostCenterForm.handleSubmit(onSubmit)()}
            size="sm"
            loading={isCreatingCostCenter}
            type="button">
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

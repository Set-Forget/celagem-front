'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { newClassSchema } from "../schema/classes";

export default function NewClass() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const newCostCenterForm = useForm<z.infer<typeof newClassSchema>>({
    resolver: zodResolver(newClassSchema),
    defaultValues: {
      name: '',
      status: 'active',
    },
  });

  const onOpenChange = () => {
    closeDialogs()
  }

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState)
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Dialog
      open={dialogState.open === "new-class"}
      onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nueva clase</DialogTitle>
          <DialogDescription>
            Crea una nueva clase para asignar a tus usuarios.
          </DialogDescription>
        </DialogHeader>
        <Form {...newCostCenterForm}>
          <form className="flex flex-col gap-4">
            <FormField
              control={newCostCenterForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Administrador"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Este será el nombre de la clase.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newCostCenterForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Este será el estado de la clase. Puedes cambiarlo en cualquier momento.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button size="sm" type="button">Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

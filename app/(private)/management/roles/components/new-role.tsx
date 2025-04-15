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
import { newRoleSchema } from "../schema/roles";

export default function NewRole() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const newCostCenterForm = useForm<z.infer<typeof newRoleSchema>>({
    resolver: zodResolver(newRoleSchema),
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
      open={dialogState.open === "new-role"}
      onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo rol</DialogTitle>
          <DialogDescription>
            Crea un nuevo rol para asignar a tus usuarios.
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
                    Este será el nombre del rol.
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
                    Este será el estado del rol. Puedes cambiarlo en cualquier momento.
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

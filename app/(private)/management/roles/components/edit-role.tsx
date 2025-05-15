// 'use client'

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  closeDialogs,
  DialogsState,
  dialogsStateObservable,
} from '@/lib/store/dialogs-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { newRoleSchema, roleUpdateBodySchema } from '../schema/roles';
import { useUpdateRoleMutation } from '@/lib/services/roles';
import { toast } from 'sonner';
import CustomSonner from '@/components/custom-sonner';

export default function EditRole({
  roleData,
}: {
  roleData: { id: string; name: string };
}) {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const editRoleForm = useForm<z.infer<typeof roleUpdateBodySchema>>({
    resolver: zodResolver(roleUpdateBodySchema),
    defaultValues: {
      name: roleData.name || '',
    },
  });

  const onOpenChange = () => {
    closeDialogs();
  };

  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateRoleMutation();

  const onSubmit = async (data: z.infer<typeof roleUpdateBodySchema>) => {
    console.log('Submitting form with data:', data);
    try {
      const response = await updateRole({
        id: roleData.id,
        body: { ...data },
      }).unwrap();

      if (response.status === 'success') {
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Rol editado exitosamente"
            variant="success"
          />
        ));
        closeDialogs();
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Ocurrió un error al editar el rol"
          variant="error"
        />
      ));
    }
  };

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Dialog
      open={dialogState.open === 'edit-role'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar rol</DialogTitle>
          <DialogDescription>Edita los detalles del rol.</DialogDescription>
        </DialogHeader>
        <Form {...editRoleForm}>
          <form className="flex flex-col gap-4">
            <FormField
              control={editRoleForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre del rol"
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
            <DialogFooter>
              <Button
                size="sm"
                type="submit"
                onClick={editRoleForm.handleSubmit(onSubmit)}
                disabled={isUpdatingRole}
              >
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

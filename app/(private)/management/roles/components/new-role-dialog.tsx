'use client';

import CustomSonner from '@/components/custom-sonner';
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
  Form
} from '@/components/ui/form';
import { useAddPermissionToRoleMutation, useCreateRoleMutation } from '@/lib/services/roles';
import { useSendMessageMutation } from '@/lib/services/telegram';
import {
  closeDialogs,
  DialogsState,
  dialogsStateObservable,
} from '@/lib/store/dialogs-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { newRoleSchema } from '../schema/roles';
import { NewRoleForm } from './new-role-form';

export default function NewRole() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const form = useForm<z.infer<typeof newRoleSchema>>({
    resolver: zodResolver(newRoleSchema),
    defaultValues: {
      name: '',
    },
  });

  const [sendMessage] = useSendMessageMutation();
  const [createRole, { isLoading: isCreatingRole }] = useCreateRoleMutation();
  const [addPermissionToRole, { isLoading: isAddingPermissionToRole }] = useAddPermissionToRoleMutation();

  const onOpenChange = () => {
    form.reset();
    closeDialogs();
  };

  const onSubmit = async (data: z.infer<typeof newRoleSchema>) => {
    const { permissions, ...rest } = data;
    try {
      const response = await createRole(rest).unwrap();

      await addPermissionToRole({
        role_id: response.data.id,
        permission_ids: permissions,
      }).unwrap();

      if (response.status === 'success') {
        toast.custom((t) => <CustomSonner t={t} description="Rol creado exitosamente" variant="success" />);
        onOpenChange();
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear el rol" variant="error" />);
      sendMessage({
        location: "app/(private)/management/roles/components/new-role-dialog.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      })
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
      open={dialogState.open === 'new-role'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nuevo rol</DialogTitle>
          <DialogDescription>
            Crea un nuevo rol para asignar a tus usuarios.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <NewRoleForm />
          <DialogFooter>
            <Button
              size="sm"
              type="submit"
              loading={isCreatingRole || isAddingPermissionToRole}
              onClick={form.handleSubmit(onSubmit)}
            >
              Crear
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

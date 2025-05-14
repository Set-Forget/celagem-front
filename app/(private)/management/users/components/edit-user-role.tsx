'use client';

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
import { useUpdateUserRoleMutation } from '@/lib/services/users';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CustomSonner from '@/components/custom-sonner';
import { AsyncSelect } from '@/components/async-select';
import { Users, userUpdateRoleBodySchema } from '../schema/users';
import { useLazyListRolesQuery } from '@/lib/services/roles';

export default function EditUserRole({ userData }: { userData: Users }) {
  const router = useRouter();

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const editUserRoleForm = useForm<z.infer<typeof userUpdateRoleBodySchema>>({
    resolver: zodResolver(userUpdateRoleBodySchema),
    defaultValues: {
      role_id: userData.role_id || '',
    },
  });

  const onOpenChange = () => {
    closeDialogs();
  };

  const [updateUserRole, { isLoading: isUpdatingUserRole }] =
    useUpdateUserRoleMutation();
  const onSubmit = async (data: z.infer<typeof userUpdateRoleBodySchema>) => {
    console.log('Form data submitted for updating user role:', data); // Debugging log
    try {
      const response = await updateUserRole({
        id: userData.id,
        body: {
          ...data,
        },
      }).unwrap();

      console.log('Update user role response:', response); // Debugging log

      if (response.status === 'success') {
        router.push(`/management/users/${userData.id}`);
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Rol de usuario actualizado exitosamente"
            variant="success"
          />
        ));
        closeDialogs();
      }
    } catch (error) {
      console.error('Error updating user role:', error); // Debugging log
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Ocurrió un error al actualizar el rol del usuario"
          variant="error"
        />
      ));
    }
  };
  const [getRoles] = useLazyListRolesQuery();

  const handleGetRoles = async () => {
    try {
      const roles = await getRoles({ company_id: '' }).unwrap();
      return roles.data.map((role) => ({
        label: role.name,
        value: role.id,
      }));
    } catch (error) {
      console.error('Error al obtener los roles:', error);
      return [];
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
      open={dialogState.open === 'edit-user-role'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cambiar rol de usuario</DialogTitle>
          <DialogDescription>
            Actualiza el rol del usuario {userData.first_name}{' '}
            {userData.last_name}.
          </DialogDescription>
        </DialogHeader>
        <Form {...editUserRoleForm}>
          <form className="flex flex-col gap-4">
            <FormField
              control={editUserRoleForm.control}
              name="role_id"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Rol</FormLabel>
                  <FormControl>
                    <AsyncSelect<{ label: string; value: string }, string>
                      label="Rol"
                      triggerClassName="!w-full"
                      placeholder="Seleccionar rol"
                      fetcher={handleGetRoles}
                      getDisplayValue={(item) => item.label}
                      getOptionValue={(item) => item.value}
                      renderOption={(item) => <div>{item.label}</div>}
                      onChange={field.onChange}
                      value={field.value}
                      noResultsMessage="No se encontraron roles"
                    />
                  </FormControl>
                  <FormDescription>
                    El rol determina los permisos del usuario.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>{' '}
          <DialogFooter>
            <Button
              size="sm"
              type="submit"
              onClick={editUserRoleForm.handleSubmit(onSubmit)}
              disabled={isUpdatingUserRole}
            >
              Actualizar
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

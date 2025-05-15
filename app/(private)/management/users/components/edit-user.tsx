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
import { useUpdateUserMutation } from '@/lib/services/users';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Users, userUpdateBodySchema } from '../schema/users';
import CustomSonner from '@/components/custom-sonner';

export default function EditUser({ userData }: { userData: Users }) {
  const router = useRouter();

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const editUserForm = useForm<z.infer<typeof userUpdateBodySchema>>({
    resolver: zodResolver(userUpdateBodySchema),
    defaultValues: {
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      email: userData.email || '',
    },
  });

  const onOpenChange = () => {
    closeDialogs();
  };

  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const onSubmit = async (data: z.infer<typeof userUpdateBodySchema>) => {
    console.log('Form data submitted for editing user:', data); // Debugging log
    try {
      const response = await updateUser({
        id: userData.id,
        body: {
          ...data,
        },
      }).unwrap();

      console.log('Edit user response:', response); // Debugging log

      if (response.status === 'success') {
        router.push(`/management/users/${response.data.id}`);
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Usuario editado exitosamente"
            variant="success"
          />
        ));
        closeDialogs();
      }
    } catch (error) {
      console.error('Error editing user:', error); // Debugging log
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Ocurrió un error al editar el usuario"
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
      open={dialogState.open === 'edit-user'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>Edita los detalles del usuario.</DialogDescription>
        </DialogHeader>
        <Form {...editUserForm}>
          {' '}
          <form className="flex flex-col gap-4">
            <FormField
              control={editUserForm.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre del usuario"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Nombre del usuario.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editUserForm.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Apellido del usuario"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Apellido del usuario.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editUserForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Correo electrónico del usuario"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Correo electrónico del usuario.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                size="sm"
                type="submit"
                onClick={editUserForm.handleSubmit(onSubmit)}
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

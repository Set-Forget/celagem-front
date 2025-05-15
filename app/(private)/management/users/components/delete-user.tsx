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
  closeDialogs,
  DialogsState,
  dialogsStateObservable,
} from '@/lib/store/dialogs-store';
import { useEffect, useState } from 'react';
import { useDeleteUserMutation } from '@/lib/services/users';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CustomSonner from '@/components/custom-sonner';

export default function DeleteUser({ userId }: { userId: string }) {
  const router = useRouter();

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const onOpenChange = () => {
    closeDialogs();
  };

  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();
  const onDelete = async () => {
    console.log('Deleting user with ID:', userId); // Debugging log
    try {
      const response = await deleteUser({ id: userId }).unwrap();

      console.log('Delete user response:', response); // Debugging log

      if (response.status === 'success') {
        router.push('/management/users', { scroll: false });
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Usuario eliminado exitosamente"
            variant="success"
          />
        ));
        closeDialogs();
      }
    } catch (err) {
      console.error('Error deleting user:', err); // Debugging log
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Ocurrió un error al eliminar el usuario"
          variant="error"
        />
      ));
      closeDialogs();
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
      open={dialogState.open === 'delete-user'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar usuario</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se
            puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletingUser}
          >
            Eliminar
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={onOpenChange}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

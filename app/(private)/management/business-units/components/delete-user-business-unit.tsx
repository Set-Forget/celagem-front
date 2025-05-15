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
import { useDeleteUserFromBusinessUnitMutation } from '@/lib/services/business-units';
import { toast } from 'sonner';
import CustomSonner from '@/components/custom-sonner';

export default function DeleteUserBusinessUnit({
  businessUnitId,
  userId,
  userName,
}: {
  businessUnitId: string;
  userId: string;
  userName?: string;
}) {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const onOpenChange = () => {
    closeDialogs();
  };

  const [deleteUserFromBusinessUnit, { isLoading: isDeletingUser }] =
    useDeleteUserFromBusinessUnitMutation();

  const onDelete = async () => {
    try {
      const response = await deleteUserFromBusinessUnit({
        Id: businessUnitId,
        UserId: userId,
      }).unwrap();

      if (response.status === 'success') {
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Usuario eliminado exitosamente de la unidad de negocio"
            variant="success"
          />
        ));
        closeDialogs();
      }
    } catch (error) {
      console.error('Error removing user from business unit:', error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Ocurrió un error al eliminar el usuario de la unidad de negocio"
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
      open={dialogState.open === 'delete-user-business-unit'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar usuario de la unidad de negocio</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar{' '}
            {userName ? `a ${userName}` : 'este usuario'} de esta unidad de
            negocio? Esta acción no se puede deshacer.
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

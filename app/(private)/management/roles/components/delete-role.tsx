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
  closeDialogs,
  DialogsState,
  dialogsStateObservable,
} from '@/lib/store/dialogs-store';
import { useEffect, useState } from 'react';
import { useDeleteRoleMutation } from '@/lib/services/roles';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function DeleteRole({ roleId }: { roleId: string }) {

  const router = useRouter();
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const onOpenChange = () => {
    closeDialogs();
  };

  const [deleteRole, { isLoading: isDeletingRole }] = useDeleteRoleMutation();

  const onDelete = async () => {
    try {
      const response = await deleteRole({ id: roleId }).unwrap();

      if (response.status === 'success') {
        toast.success('Rol eliminado exitosamente');
        router.push('/management/roles');
        closeDialogs();
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Ocurrió un error al eliminar el rol');
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
      open={dialogState.open === 'delete-role'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar rol</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar este rol? Esta acción no se
            puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletingRole}
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

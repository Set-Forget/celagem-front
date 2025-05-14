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
import { useDeleteBusinessUnitMutation } from '@/lib/services/business-units';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function DeleteBusinessUnit({
  businessUnitId,
}: {
  businessUnitId: string;
}) {
  const router = useRouter();
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const onOpenChange = () => {
    closeDialogs();
  };

  const [deleteBusinessUnit, { isLoading: isDeletingBusinessUnit }] =
    useDeleteBusinessUnitMutation();

  const onDelete = async () => {
    try {
      const response = await deleteBusinessUnit({
        Id: businessUnitId,
      }).unwrap();

      if (response.status === 'success') {
        toast.success('Unidad de negocio eliminada exitosamente');
        router.push('/management/business-units');
        closeDialogs();
      }
    } catch (error) {
      console.error('Error deleting business unit:', error);
      toast.error('Ocurrió un error al eliminar la unidad de negocio');
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
      open={dialogState.open === 'delete-business-unit'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar unidad de negocio</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar esta unidad de negocio? Esta
            acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletingBusinessUnit}
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

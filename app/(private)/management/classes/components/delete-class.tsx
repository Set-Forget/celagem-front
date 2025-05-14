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
import { useDeleteClassMutation } from '@/lib/services/classes';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import CustomSonner from '@/components/custom-sonner';

export default function DeleteClass({ classId }: { classId: string }) {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const router = useRouter();

  const onOpenChange = () => {
    closeDialogs();
  };

  const [deleteClass, { isLoading: isDeletingClass }] =
    useDeleteClassMutation();

  const onDelete = async () => {
    try {
      const response = await deleteClass({ id: classId }).unwrap();

      if (response.status === 'success') {
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Clase eliminada exitosamente"
            variant="success"
          />
        ));
        router.push('/management/classes', { scroll: false });
        closeDialogs();
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Ocurrió un error al eliminar la clase"
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
      open={dialogState.open === 'delete-class'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar clase</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar esta clase? Esta acción no se
            puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletingClass}
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

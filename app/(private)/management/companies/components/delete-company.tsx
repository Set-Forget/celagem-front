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
import { useDeleteCompanyMutation } from '@/lib/services/companies';
import {
  closeDialogs,
  DialogsState,
  dialogsStateObservable,
} from '@/lib/store/dialogs-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function DeleteCompany({ companyId }: { companyId: string }) {
  const router = useRouter();

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const onOpenChange = () => {
    closeDialogs();
  };

  const [deleteCompany, { isLoading: isDeletingCompany }] =
    useDeleteCompanyMutation();

  const onDelete = async () => {
    console.log('Deleting company with ID:', companyId); // Debugging log
    try {
      const response = await deleteCompany({ id: companyId }).unwrap();

      console.log('Delete company response:', response); // Debugging log

      if (response.status === 'success') {
        router.push('/management/companies', { scroll: false });
        toast.success('Sede eliminada exitosamente');
        closeDialogs();
      }
    } catch (err) {
      console.error('Error deleting company:', err); // Debugging log
      toast.error('Ocurrió un error al eliminar la sede');
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
      open={dialogState.open === 'delete-company'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar empresa</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar esta empresa? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletingCompany}
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

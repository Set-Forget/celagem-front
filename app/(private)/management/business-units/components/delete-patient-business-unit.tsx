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
import { useDeletePatientFromBusinessUnitMutation } from '@/lib/services/business-units';
import { toast } from 'sonner';
import CustomSonner from '@/components/custom-sonner';

export default function DeletePatientBusinessUnit({
  businessUnitId,
  patientId,
  patientName,
}: {
  businessUnitId: string;
  patientId: string;
  patientName?: string;
}) {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const onOpenChange = () => {
    closeDialogs();
  };

  const [deletePatientFromBusinessUnit, { isLoading: isDeletingPatient }] =
    useDeletePatientFromBusinessUnitMutation();

  const onDelete = async () => {
    try {
      const response = await deletePatientFromBusinessUnit({
        Id: businessUnitId,
        PatientId: patientId,
      }).unwrap();

      if (response.status === 'success') {
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Paciente eliminado exitosamente de la unidad de negocio"
            variant="success"
          />
        ));
        closeDialogs();
      } else if (response.status === 'error') {
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description={response.message}
            variant="error"
          />
        ));
        closeDialogs();
      }
    } catch (error) {
      console.error('Error removing patient from business unit:', error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Ocurrió un error al eliminar el paciente de la unidad de negocio"
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
      open={dialogState.open === 'delete-patient-business-unit'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar paciente de la unidad de negocio</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar{' '}
            {patientName ? `a ${patientName}` : 'este paciente'} de esta unidad
            de negocio? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletingPatient}
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

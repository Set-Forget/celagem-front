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
import { Form } from '@/components/ui/form';
import { useCreateBusinessUnitMutation } from '@/lib/services/business-units';
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
import { newBusinessUnitSchema } from '../schema/business-units';
import NewBusinessUnitForm from './new-business-unit-form';

export default function NewBusinessUnitDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });
  const [sendMessage] = useSendMessageMutation();

  const newBusinessUnitForm = useForm<z.infer<typeof newBusinessUnitSchema>>({
    resolver: zodResolver(newBusinessUnitSchema),
    defaultValues: {
      name: '',
      description: '',
      company_id: '',
    },
  });

  const onOpenChange = () => {
    newBusinessUnitForm.reset();
    closeDialogs();
  };

  const [createBusinessUnit, { isLoading: isCreatingBusinessUnit }] = useCreateBusinessUnitMutation();

  const onSubmit = async (data: z.infer<typeof newBusinessUnitSchema>) => {
    try {
      const response = await createBusinessUnit(data).unwrap();
      if (response.status === 'success') {
        onOpenChange();
        toast.custom((t) => <CustomSonner t={t} description="Unidad de negocio creada exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la unidad de negocio" variant="error" />);
      sendMessage({
        location: "app/(private)/management/business-units/components/new-business-unit-dialog.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      });
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
      open={dialogState.open === 'new-business-unit'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Nueva unidad de negocio</DialogTitle>
          <DialogDescription>
            Crea una nueva unidad de negocio para gestionar.
          </DialogDescription>
        </DialogHeader>
        <Form {...newBusinessUnitForm}>
          <NewBusinessUnitForm />
        </Form>
        <DialogFooter>
          <Button
            size="sm"
            type='submit'
            loading={isCreatingBusinessUnit}
            onClick={newBusinessUnitForm.handleSubmit(onSubmit)}
          >
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
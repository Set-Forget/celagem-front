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
import { useGetBusinessUnitQuery, useUpdateBusinessUnitMutation } from '@/lib/services/business-units';
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

export default function EditBusinessUnitDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });
  const businessUnitId = dialogState?.payload?.business_unit_id as string;

  const [sendMessage] = useSendMessageMutation();

  const { data: businessUnit, isLoading: isBusinessUnitLoading } = useGetBusinessUnitQuery(businessUnitId, {
    skip: !businessUnitId
  });

  const form = useForm<z.infer<typeof newBusinessUnitSchema>>({
    resolver: zodResolver(newBusinessUnitSchema),
    defaultValues: {
      name: '',
      description: '',
      company_id: '',
    },
  });

  const onOpenChange = () => {
    form.reset();
    closeDialogs();
  };

  const [updateBusinessUnit, { isLoading: isUpdatingBusinessUnit }] = useUpdateBusinessUnitMutation();

  const onSubmit = async (data: z.infer<typeof newBusinessUnitSchema>) => {
    try {
      const response = await updateBusinessUnit({
        id: businessUnitId,
        body: data
      }).unwrap();
      if (response.status === 'success') {
        onOpenChange();
        toast.custom((t) => <CustomSonner t={t} description="Unidad de negocio actualizada exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar la unidad de negocio" variant="error" />);
      sendMessage({
        location: "app/(private)/management/business-units/components/edit-business-unit-dialog.tsx",
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

  useEffect(() => {
    if (businessUnit) {
      form.reset(businessUnit);
    }
  }, [businessUnit]);

  return (
    <Dialog
      open={dialogState.open === 'edit-business-unit'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Editar unidad de negocio</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only" />
        <Form {...form}>
          <NewBusinessUnitForm isEditing />
        </Form>
        <DialogFooter>
          <Button
            size="sm"
            type='submit'
            loading={isUpdatingBusinessUnit}
            onClick={form.handleSubmit(onSubmit)}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
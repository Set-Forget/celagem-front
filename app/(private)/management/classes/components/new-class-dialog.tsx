"use client";

import CustomSonner from '@/components/custom-sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useCreateClassMutation } from '@/lib/services/classes';
import { closeDialogs, DialogsState, dialogsStateObservable } from '@/lib/store/dialogs-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { newClassSchema } from '../schema/classes';
import NewClassForm from './new-class-form';
import { useSendMessageMutation } from '@/lib/services/telegram';

export default function NewClassDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const newClassForm = useForm<z.infer<typeof newClassSchema>>({
    resolver: zodResolver(newClassSchema),
    defaultValues: { name: '', company_id: '' },
  });

  const [sendMessage] = useSendMessageMutation();
  const [createClass, { isLoading: isCreatingClass }] = useCreateClassMutation();

  const onOpenChange = () => {
    newClassForm.reset();
    closeDialogs();
  };

  const onSubmit = async (data: z.infer<typeof newClassSchema>) => {
    try {
      const response = await createClass(data).unwrap();
      if (response.status === 'success') {
        onOpenChange();
        toast.custom((t) => <CustomSonner t={t} description="Clase creada exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la clase" variant="error" />);
      sendMessage({
        location: "app/(private)/management/classes/components/new-class-dialog.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      });
    }
  };

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState);
    return () => { subscription.unsubscribe(); };
  }, []);

  return (
    <Dialog open={dialogState.open === 'new-class'} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Nueva clase</DialogTitle>
          <DialogDescription>
            Crea una nueva clase para asignar a tus usuarios.
          </DialogDescription>
        </DialogHeader>
        <Form {...newClassForm}>
          <NewClassForm />
        </Form>
        <DialogFooter>
          <Button size="sm" type='submit' loading={isCreatingClass} onClick={newClassForm.handleSubmit(onSubmit)}>
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
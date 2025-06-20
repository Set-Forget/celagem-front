"use client";

import CustomSonner from '@/components/custom-sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useGetClassQuery, useUpdateClassMutation } from '@/lib/services/classes';
import { closeDialogs, DialogsState, dialogsStateObservable } from '@/lib/store/dialogs-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { newClassSchema } from '../schema/classes';
import NewClassForm from './new-class-form';
import { useSendMessageMutation } from '@/lib/services/telegram';

export default function EditClassDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const classId = dialogState?.payload?.class_id as string;

  const [sendMessage] = useSendMessageMutation();
  const [updateClass, { isLoading: isUpdatingClass }] = useUpdateClassMutation();

  const { data: classData } = useGetClassQuery(classId, { skip: !classId });

  const form = useForm<z.infer<typeof newClassSchema>>({
    resolver: zodResolver(newClassSchema),
    defaultValues: {
      name: '',
      company_id: '',
    },
  });

  const onOpenChange = () => {
    form.reset();
    closeDialogs();
  };

  const onSubmit = async (data: z.infer<typeof newClassSchema>) => {
    try {
      const response = await updateClass({ id: classId, body: data }).unwrap();
      if (response.status === 'success') {
        onOpenChange();
        toast.custom((t) => <CustomSonner t={t} description="Clase actualizada exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar la clase" variant="error" />);
      sendMessage({
        location: "app/(private)/management/classes/components/edit-class-dialog.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      });
    }
  };

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState);
    return () => { subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (classData) {
      form.reset(classData);
    }
  }, [classData]);

  return (
    <Dialog open={dialogState.open === 'edit-class'} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Editar clase</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only" />
        <Form {...form}>
          <NewClassForm isEditing />
        </Form>
        <DialogFooter>
          <Button size="sm" type='submit' loading={isUpdatingClass} onClick={form.handleSubmit(onSubmit)}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
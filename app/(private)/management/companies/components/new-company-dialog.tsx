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
import {
  Form
} from '@/components/ui/form';
import { useCreateCompanyMutation } from '@/lib/services/companies';
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
import { newCompanySchema } from '../schema/companies';
import NewCompanyForm from './new-company-form';

export default function NewCompanyDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const [sendMessage] = useSendMessageMutation();

  const newCompanyForm = useForm<z.infer<typeof newCompanySchema>>({
    resolver: zodResolver(newCompanySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onOpenChange = () => {
    newCompanyForm.reset();
    closeDialogs();
  };

  const [createCompany, { isLoading: isCreatingCompany }] = useCreateCompanyMutation();

  const onSubmit = async (data: z.infer<typeof newCompanySchema>) => {
    try {
      const response = await createCompany(data).unwrap();

      if (response.status === 'success') {
        onOpenChange();
        toast.custom((t) => <CustomSonner t={t} description="Sede creada exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la sede" variant="error" />);
      sendMessage({
        location: "app/(private)/management/companies/components/new-company.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      })
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
      open={dialogState.open === 'new-company'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Nueva compañía</DialogTitle>
          <DialogDescription>
            Crea una nueva compañía para gestionar.
          </DialogDescription>
        </DialogHeader>
        <Form {...newCompanyForm}>
          <NewCompanyForm />
        </Form>
        <DialogFooter>
          <Button
            size="sm"
            type='submit'
            loading={isCreatingCompany}
            onClick={newCompanyForm.handleSubmit(onSubmit)}
          >
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

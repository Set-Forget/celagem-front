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
import { useCreateCompanyMutation, useGetCompanyQuery, useUpdateCompanyMutation } from '@/lib/services/companies';
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

export default function EditCompanyDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const companyId = dialogState?.payload?.company_id as string

  const [sendMessage] = useSendMessageMutation();
  const { data: company, isLoading: isCompanyLoading } = useGetCompanyQuery(companyId, {
    skip: !companyId
  })

  const form = useForm<z.infer<typeof newCompanySchema>>({
    resolver: zodResolver(newCompanySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onOpenChange = () => {
    form.reset();
    closeDialogs();
  };

  const [updateCompany, { isLoading: isUpdatingCompany }] = useUpdateCompanyMutation();

  const onSubmit = async (data: z.infer<typeof newCompanySchema>) => {
    try {
      const response = await updateCompany({
        id: companyId,
        body: data
      }).unwrap();

      if (response.status === 'success') {
        onOpenChange();
        toast.custom((t) => <CustomSonner t={t} description="Compañía actualizada exitosamente" variant="success" />);
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar la compañía" variant="error" />);
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

  useEffect(() => {
    if (company) {
      form.reset(company);
    }
  }, [company]);

  return (
    <Dialog
      open={dialogState.open === 'edit-company'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Editar compañía</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only" />
        <Form {...form}>
          <NewCompanyForm />
        </Form>
        <DialogFooter>
          <Button
            size="sm"
            type='submit'
            loading={isUpdatingCompany}
            onClick={form.handleSubmit(onSubmit)}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

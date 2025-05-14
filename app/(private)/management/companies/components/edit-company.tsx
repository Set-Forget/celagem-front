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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  closeDialogs,
  DialogsState,
  dialogsStateObservable,
} from '@/lib/store/dialogs-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Companies, CompanyCreateBody, NewCompany, newCompanySchema } from '../schema/companies';
import { useUpdateCompanyMutation } from '@/lib/services/companies';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


export default function EditCompany({ companyData }: { companyData: Companies }) {
  const router = useRouter();

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const editCompanyForm = useForm<z.infer<typeof newCompanySchema>>({
    resolver: zodResolver(newCompanySchema),
    defaultValues: {
      name: companyData.name || '',
      description: companyData.description || '',
    },
  });

  const onOpenChange = () => {
    closeDialogs();
  };

  const [updateCompany, { isLoading: isUpdatingCompany }] =
    useUpdateCompanyMutation();

  const onSubmit = async (data: z.infer<typeof newCompanySchema>) => {
    console.log('Form data submitted for editing:', data); // Debugging log
    try {
      const response = await updateCompany({
        id: companyData.id,
        body: {
          ...data,
        },
      }).unwrap();

      console.log('Edit company response:', response); // Debugging log

      if (response.status === 'success') {
        router.push(`/management/companies/${response.data.id}`);
        toast.success('Sede editada exitosamente');
        closeDialogs();
      }
    } catch (error) {
      console.error('Error editing company:', error); // Debugging log
      toast.error('Ocurrió un error al editar la sede');
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
      open={dialogState.open === 'edit-company'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar empresa</DialogTitle>
          <DialogDescription>
            Edita los detalles de la empresa.
          </DialogDescription>
        </DialogHeader>
        <Form {...editCompanyForm}>
          <form className="flex flex-col gap-4">
            <FormField
              control={editCompanyForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre de la empresa"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Este será el nombre de la empresa.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editCompanyForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descripción de la empresa"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Este será la descripción de la empresa.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                size="sm"
                type="submit"
                onClick={editCompanyForm.handleSubmit(onSubmit)}
              >
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

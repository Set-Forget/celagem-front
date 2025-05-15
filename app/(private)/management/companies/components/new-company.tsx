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
import { newCompanySchema } from '../schema/companies';
import { useCreateCompanyMutation } from '@/lib/services/companies';
import {useRouter} from 'next/navigation';
import { toast } from 'sonner';
import CustomSonner from '@/components/custom-sonner';

export default function NewCompany() {

  const router = useRouter()

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const newCompanyForm = useForm<z.infer<typeof newCompanySchema>>({
    resolver: zodResolver(newCompanySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onOpenChange = () => {
    closeDialogs();
  };

  const [createCompany, { isLoading: isCreatingCompany }] =
    useCreateCompanyMutation();

  const onSubmit = async (
    data: z.infer<typeof newCompanySchema>
  ) => {
    console.log('Form data submitted:', 'data'); // Debugging log
    try {
      const response = await createCompany({
        ...data,
      }).unwrap();

      console.log('Create company response:', response); // Debugging log

      if (response.status === 'success') {
        router.push(`/management/companies/${response.data.id}`);
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Sede creada exitosamente"
            variant="success"
          />
        ));
      }
    } catch (error) {
      console.error('Error creating company:', error); // Debugging log
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Ocurrió un error al crear la sede"
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
      open={dialogState.open === 'new-company'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nueva empresa</DialogTitle>
          <DialogDescription>
            Crea una nueva empresa para gestionar.
          </DialogDescription>
        </DialogHeader>
        <Form {...newCompanyForm}>
          <form className="flex flex-col gap-4">
            <FormField
              control={newCompanyForm.control}
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
              control={newCompanyForm.control}
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
                type='submit'
                onClick={newCompanyForm.handleSubmit(onSubmit)}
              >
                Crear
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

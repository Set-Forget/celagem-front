'use client';

import { AsyncSelect } from '@/components/async-select';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateClassMutation } from '@/lib/services/classes';
import { useLazyListCompaniesQuery } from '@/lib/services/companies';
import {
  closeDialogs,
  DialogsState,
  dialogsStateObservable,
} from '@/lib/store/dialogs-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { newClassSchema } from '../schema/classes';

export default function NewClass() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const router = useRouter();

  const newClassForm = useForm<z.infer<typeof newClassSchema>>({
    resolver: zodResolver(newClassSchema),
    defaultValues: {
      name: '',
      company_id: '',
    },
  });

  const onOpenChange = () => {
    closeDialogs();
  };

  const [createClass, { isLoading: isCreatingClass }] = useCreateClassMutation();

  const [getCompanies, { data: companies }] = useLazyListCompaniesQuery();

  const handleGetCompanies = async () => {
    try {
      const companies = await getCompanies().unwrap();
      return companies.data.map((company) => ({
        label: company.name,
        value: company.id,
      }));
    } catch (error) {
      console.error('Error al obtener las sedes:', error);
      return [];
    }
  };

  const onSubmit = async (data: z.infer<typeof newClassSchema>) => {
    console.log('Form data submitted:', data); // Debugging log
    try {
      const response = await createClass({
        ...data,
      }).unwrap();

      console.log('Create role response:', response); // Debugging log

      if (response.status === 'success') {
        router.push(`/management/classes/${response.data.id}`);
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Clase creada exitosamente"
            variant="success"
          />
        ));
      }
    } catch (error) {
      console.error('Error creating class:', error); // Debugging log
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Ocurrió un error al crear la clase"
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
      open={dialogState.open === 'new-class'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nueva clase</DialogTitle>
          <DialogDescription>
            Crea una nueva clase para asignar a tus usuarios.
          </DialogDescription>
        </DialogHeader>
        <Form {...newClassForm}>
          <form className="flex flex-col gap-4">
            <FormField
              control={newClassForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Administrador"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Este será el nombre de la clase.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newClassForm.control}
              name="company_id"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormControl>
                    <AsyncSelect<{ label: string; value: string }, string>
                      label="Sede"
                      triggerClassName="!w-full"
                      placeholder="Seleccionar sede"
                      fetcher={handleGetCompanies}
                      getDisplayValue={(item) => item.label}
                      getOptionValue={(item) => item.value}
                      renderOption={(item) => <div>{item.label}</div>}
                      onChange={field.onChange}
                      value={field.value}
                      noResultsMessage="No se encontraron sedes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={newCostCenterForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Este será el estado de la clase. Puedes cambiarlo en cualquier momento.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </form>
        </Form>
        <DialogFooter>
          <Button
            size="sm"
            type="button"
            onClick={newClassForm.handleSubmit(onSubmit)}
          >
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

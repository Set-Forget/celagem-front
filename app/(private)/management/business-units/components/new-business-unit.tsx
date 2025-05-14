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
import { businessUnitCreateBodySchema } from '../schema/business-units';
import { useCreateBusinessUnitMutation } from '@/lib/services/business-units';
import { useLazyListCompaniesQuery } from '@/lib/services/companies';
import { AsyncSelect } from '@/components/async-select';
import { toast } from 'sonner';
import CustomSonner from '@/components/custom-sonner';

export default function NewBusinessUnit() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const newBusinessUnitForm = useForm<
    z.infer<typeof businessUnitCreateBodySchema>
  >({
    resolver: zodResolver(businessUnitCreateBodySchema),
    defaultValues: {
      name: '',
      description: '',
      company_id: '',
    },
  });

  const onOpenChange = () => {
    closeDialogs();
  };

  const [getCompanies] = useLazyListCompaniesQuery();
  const [createBusinessUnit, { isLoading: isCreatingBusinessUnit }] =
    useCreateBusinessUnitMutation();

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
  const onSubmit = async (
    data: z.infer<typeof businessUnitCreateBodySchema>
  ) => {
    try {
      const response = await createBusinessUnit(data).unwrap();

      if (response.status === 'success') {
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Unidad de negocio creada exitosamente"
            variant="success"
          />
        ));
        newBusinessUnitForm.reset();
        closeDialogs();
      }
    } catch (error) {
      console.error('Error creating business unit:', error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Ocurrió un error al crear la unidad de negocio"
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
      open={dialogState.open === 'new-business-unit'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear unidad de negocio</DialogTitle>
          <DialogDescription>
            Ingrese los detalles para crear una nueva unidad de negocio.
          </DialogDescription>
        </DialogHeader>
        <Form {...newBusinessUnitForm}>
          <form className="flex flex-col gap-4">
            <FormField
              control={newBusinessUnitForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre de la unidad de negocio"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Este será el nombre de la unidad de negocio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newBusinessUnitForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descripción de la unidad de negocio"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será la descripción de la unidad de negocio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newBusinessUnitForm.control}
              name="company_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sede</FormLabel>
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
                  <FormDescription>
                    Esta será la sede asociada a la unidad de negocio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                size="sm"
                type="submit"
                onClick={newBusinessUnitForm.handleSubmit(onSubmit)}
                disabled={isCreatingBusinessUnit}
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

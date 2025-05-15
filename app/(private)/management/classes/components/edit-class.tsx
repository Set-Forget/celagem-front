// 'use client'

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
import { useUpdateClassMutation } from '@/lib/services/classes';
import { useLazyListCompaniesQuery } from '@/lib/services/companies';
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
import { Classes, newClassSchema } from '../schema/classes';

export default function EditClass({ classData }: { classData: Classes }) {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const editClassForm = useForm<z.infer<typeof newClassSchema>>({
    resolver: zodResolver(newClassSchema),
    defaultValues: {
      name: classData.name || '',
      company_id: classData.company_id || '',
    },
  });

  const onOpenChange = () => {
    closeDialogs();
  };

  const [updateClass, { isLoading: isUpdatingClass }] =
    useUpdateClassMutation();

  const onSubmit = async (data: z.infer<typeof newClassSchema>) => {
    try {
      const response = await updateClass({
        id: classData.id,
        body: { ...data },
      }).unwrap();

      if (response.status === 'success') {
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Clase editada exitosamente"
            variant="success"
          />
        ));
        closeDialogs();
      }
    } catch (error) {
      console.error('Error updating class:', error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Ocurrió un error al actualizar la clase"
          variant="error"
        />
      ));
    }
  };

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

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Dialog
      open={dialogState.open === 'edit-class'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar clase</DialogTitle>
          <DialogDescription>Edita los detalles de la clase.</DialogDescription>
        </DialogHeader>
        <Form {...editClassForm}>
          <form className="flex flex-col gap-4">
            <FormField
              control={editClassForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre de la clase"
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
            {/* <FormField
              control={editClassForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                    Este será el estado de la clase. Puedes cambiarlo en
                    cualquier momento.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <DialogFooter>
              <Button
                size="sm"
                type="submit"
                onClick={editClassForm.handleSubmit(onSubmit)}
                disabled={isUpdatingClass}
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

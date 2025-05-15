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
import {
  BusinessUnit,
  businessUnitUpdateBodySchema,
} from '../schema/business-units';
import { useUpdateBusinessUnitMutation } from '@/lib/services/business-units';
import { toast } from 'sonner';
import CustomSonner from '@/components/custom-sonner';

export default function EditBusinessUnit({
  businessUnitData,
}: {
  businessUnitData: BusinessUnit;
}) {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const editBusinessUnitForm = useForm<
    z.infer<typeof businessUnitUpdateBodySchema>
  >({
    resolver: zodResolver(businessUnitUpdateBodySchema),
    defaultValues: {
      name: businessUnitData.name || '',
      description: businessUnitData.description || '',
    },
  });
  const onOpenChange = () => {
    closeDialogs();
  };

  const [updateBusinessUnit, { isLoading: isUpdatingBusinessUnit }] =
    useUpdateBusinessUnitMutation();

  const onSubmit = async (
    data: z.infer<typeof businessUnitUpdateBodySchema>
  ) => {
    try {
      const response = await updateBusinessUnit({
        Id: businessUnitData.id,
        Body: { ...data },
      }).unwrap();
      if (response.status === 'success') {
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Unidad de negocio editada exitosamente"
            variant="success"
          />
        ));
        closeDialogs();
      }
    } catch (error) {
      console.error('Error updating business unit:', error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Ocurrió un error al editar la unidad de negocio"
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
      open={dialogState.open === 'edit-business-unit'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar unidad de negocio</DialogTitle>
          <DialogDescription>
            Edita los detalles de la unidad de negocio.
          </DialogDescription>
        </DialogHeader>
        <Form {...editBusinessUnitForm}>
          {' '}
          <form className="flex flex-col gap-4">
            <FormField
              control={editBusinessUnitForm.control}
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
              control={editBusinessUnitForm.control}
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
            <DialogFooter>
              <Button
                size="sm"
                type="submit"
                onClick={editBusinessUnitForm.handleSubmit(onSubmit)}
                disabled={isUpdatingBusinessUnit}
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

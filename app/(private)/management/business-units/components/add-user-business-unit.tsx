'use client';

import { AsyncMultiSelect } from '@/components/async-multi-select';
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
import {
  useAddUserToBusinessUnitMutation,
  useGetBusinessUnitQuery,
} from '@/lib/services/business-units';
import { useLazyListUsersQuery } from '@/lib/services/users';
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
import { businessUnitAddUserSchema } from '../schema/business-units';

export default function AddUserBusinessUnit({
  businessUnitId,
}: {
  businessUnitId: string;
}) {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const addUserForm = useForm<z.infer<typeof businessUnitAddUserSchema>>({
    resolver: zodResolver(businessUnitAddUserSchema),
    defaultValues: {
      user_ids: [],
    },
  });
  const onOpenChange = () => {
    closeDialogs();
  };

  const { data: businessUnit } = useGetBusinessUnitQuery(businessUnitId);
  const [getUsers] = useLazyListUsersQuery();
  const [addUserToBusinessUnit, { isLoading: isAddingUser }] =
    useAddUserToBusinessUnitMutation();
  const handleGetUsers = async () => {
    try {
      // Use company_id from the business unit to filter users
      const params = businessUnit?.company_id
        ? { company_id: businessUnit.company_id }
        : undefined;

      const response = await getUsers(params).unwrap();
      return response.data.map((user) => ({
        label: `${user.first_name} ${user.last_name} (${user.email})`,
        value: user.id,
      }));
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  };
  const onSubmit = async (data: z.infer<typeof businessUnitAddUserSchema>) => {
    try {
      const response = await addUserToBusinessUnit({
        Id: businessUnitId,
        Body: { ...data },
      }).unwrap();

      if (response.status === 'success') {
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Usuario agregado exitosamente a la unidad de negocio"
            variant="success"
          />
        ));
        addUserForm.reset();
        closeDialogs();
      }
    } catch (error) {
      console.error('Error adding user to business unit:', error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Ocurrió un error al agregar el usuario a la unidad de negocio"
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

  // Reset form when dialog opens or business unit changes
  useEffect(() => {
    if (dialogState.open === 'add-user-business-unit') {
      addUserForm.reset();
    }
  }, [dialogState.open, businessUnit, addUserForm]);

  return (
    <Dialog
      open={dialogState.open === 'add-user-business-unit'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Usuario a Unidad de Negocio</DialogTitle>
          <DialogDescription>
            Seleccione un usuario para agregarlo a esta unidad de negocio.
          </DialogDescription>
        </DialogHeader>
        <Form {...addUserForm}>
          <form className="flex flex-col gap-4">
            <FormField
              control={addUserForm.control}
              name="user_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>{' '}
                  <FormControl>
                    <AsyncMultiSelect<{ label: string; value: string }, string>
                      key={`users-${businessUnit?.company_id || 'empty'}`}
                      placeholder={
                        businessUnit?.company_id
                          ? 'Seleccionar usuario'
                          : 'Cargando información...'
                      }
                      fetcher={handleGetUsers}
                      getDisplayValue={(item) => item.label}
                      getOptionValue={(item) => item.value}
                      renderOption={(item) => <div>{item.label}</div>}
                      onValueChange={field.onChange}
                      value={field.value}
                      noResultsMessage="No se encontraron usuarios"
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    Este usuario será agregado a la unidad de negocio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                size="sm"
                type="submit"
                onClick={addUserForm.handleSubmit(onSubmit)}
                disabled={isAddingUser}
              >
                Agregar Usuario
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

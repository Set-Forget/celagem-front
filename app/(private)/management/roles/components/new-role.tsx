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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  closeDialogs,
  DialogsState,
  dialogsStateObservable,
} from '@/lib/store/dialogs-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { newRoleSchema } from '../schema/roles';
import { useCreateRoleMutation } from '@/lib/services/roles';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CustomSonner from '@/components/custom-sonner';
import { AsyncSelect } from '@/components/async-select';
import { useLazyListCompaniesQuery } from '@/lib/services/companies';

export default function NewRole() {
  const router = useRouter();

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const newRoleForm = useForm<z.infer<typeof newRoleSchema>>({
    resolver: zodResolver(newRoleSchema),
    defaultValues: {
      name: '',
    },
  });

  const onOpenChange = () => {
    closeDialogs();
  };

  const [createRole, { isLoading: isCreatingRole }] = useCreateRoleMutation();

  const onSubmit = async (data: z.infer<typeof newRoleSchema>) => {
    console.log('Form data submitted:', data); // Debugging log
    try {
      const response = await createRole({
        ...data,
      }).unwrap();

      console.log('Create role response:', response); // Debugging log

      if (response.status === 'success') {
        router.push(`/management/roles/${response.data.id}`);
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Rol creado exitosamente"
            variant="success"
          />
        ));
      }
    } catch (error) {
      console.error('Error creating company:', error); // Debugging log
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Ocurrió un error al crear el rol"
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
      open={dialogState.open === 'new-role'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo rol</DialogTitle>
          <DialogDescription>
            Crea un nuevo rol para asignar a tus usuarios.
          </DialogDescription>
        </DialogHeader>
        <Form {...newRoleForm}>
          <form className="flex flex-col gap-4">
            <FormField
              control={newRoleForm.control}
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
                    Este será el nombre del rol.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newRoleForm.control}
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
          </form>
          <DialogFooter>
            <Button
              size="sm"
              type="submit"
              onClick={newRoleForm.handleSubmit(onSubmit)}
            >
              Crear
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

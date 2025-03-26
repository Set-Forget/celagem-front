import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useFormContext, useWatch } from 'react-hook-form';

import { z } from 'zod';
import { newUserSchema } from '../../schema/users';
import { AsyncSelect } from '@/components/async-select';
import { useLazyListCompaniesQuery } from '@/lib/services/companies';
import { useLazyListRolesQuery } from '@/lib/services/roles';

export default function GeneralForm() {
  const { setValue, control } = useFormContext<z.infer<typeof newUserSchema>>();

  const [getCompanies] = useLazyListCompaniesQuery();
  const [getRoles] = useLazyListRolesQuery();

  const handleGetCompanies = async () => {
    try {
      const companies = await getCompanies().unwrap();
      return companies.data.map((company) => ({
        label: company.name,
        value: company.id,
      }));
    } catch (error) {
      console.error('Error al obtener la sede:', error);
      return [];
    }
  };

  const handleGetRoles = async (query?: string) => {
    try {
      const roles = await getRoles().unwrap();
      return roles.data.map((role) => ({
        label: role.name,
        value: role.id,
      }));
    } catch (error) {
      console.error('Error al obtener el rol:', error);
      return [];
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="first_name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Nombre</FormLabel>
            <FormControl>
              <Input
                placeholder="Nombre"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el nombre asociado al usuario.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="last_name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Apellido</FormLabel>
            <FormControl>
              <Input
                placeholder="Apellido"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el apellido asociado al usuario.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Correo electrónico</FormLabel>
            <FormControl>
              <Input
                placeholder="Correo electrónico"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el correo electrónico asociado al usuario.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="role_id"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Rol</FormLabel>
            <FormControl>
              <AsyncSelect<{ label: string; value: string }, string>
                label="Rol"
                triggerClassName="!w-full"
                placeholder="Seleccionar rol"
                fetcher={handleGetRoles}
                getDisplayValue={(item) => item.label}
                getOptionValue={(item) => item.value}
                renderOption={(item) => <div>{item.label}</div>}
                onChange={field.onChange}
                value={field.value}
                noResultsMessage="No se encontraron roles"
              />
            </FormControl>
            <FormDescription>
              Esta será el rol asociado al usuario.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="company_id"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Sede</FormLabel>
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
              Esta será la sede asociada al usuario.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

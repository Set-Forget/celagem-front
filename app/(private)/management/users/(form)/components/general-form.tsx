'use client';

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
import {
  useLazyListBusinessUnitsQuery,
  useListBusinessUnitsQuery,
} from '@/lib/services/business-units';
import { AsyncMultiSelect } from '@/components/async-multi-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { get } from 'lodash';
import { useEffect, useState } from 'react';

export default function GeneralForm() {
  const { setValue, control, getValues } =
    useFormContext<z.infer<typeof newUserSchema>>();

  const [getCompanies] = useLazyListCompaniesQuery();
  const [getRoles] = useLazyListRolesQuery();
  const [getBusinessUnits] = useLazyListBusinessUnitsQuery();

  const [roles, setRoles] = useState([]);
  const [businessUnits, setBusinessUnits] = useState([]);

  // Watch for company_id changes to refetch roles
  const companyId = useWatch({
    control,
    name: 'company_id',
  });

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
      const roles = await getRoles({ company_id: ''}).unwrap();
      return roles.data.map((role) => ({
        label: role.name,
        value: role.id,
      }));
    } catch (error) {
      console.error('Error al obtener el rol:', error);
      return [];
    }
  };

  const handleGetBusinessUnits = async (query?: string) => {
    try {
      const businessUnits = await getBusinessUnits().unwrap();
      return businessUnits.data.map((unit) => ({
        label: unit.name,
        value: unit.id,
      }));
    } catch (error) {
      console.error('Error al obtener las unidades de negocio:', error);
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
            <FormMessage />
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
            <FormMessage />
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
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Contraseña</FormLabel>
            <FormControl>
              <Input
                placeholder="Contraseña"
                {...field}
                type="password"
              />
            </FormControl>
            <FormDescription>
              Esta será la contraseña asociada al usuario.
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
        name={'business_units'}
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Unidades de negocio</FormLabel>
            <FormControl>
              <AsyncMultiSelect<{ value: string; label: string }, string>
                className={cn(
                  '!w-full bg-transparent pl-4',
                  control._formState.errors.business_units &&
                    'outline outline-1 outline-offset-[-1px] outline-destructive'
                )}
                searchPlaceholder="Buscar unidades de negocio..."
                placeholder="Seleccionar unidades de negocio"
                fetcher={handleGetBusinessUnits}
                getDisplayValue={(item) => (
                  <div className="flex gap-1">{item.label}</div>
                )}
                getOptionValue={(item) => item.value}
                renderOption={(item) => <>{item.label}</>}
                onValueChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => String(item.value)}
                noResultsMessage="No se encontraron resultados"
                defaultValue={field.value}
                variant="secondary"
              />
            </FormControl>
            <FormDescription>
              Estas serán las unidades de negocio asociadas al usuario.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

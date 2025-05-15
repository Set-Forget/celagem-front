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

import { AsyncMultiSelect } from '@/components/async-multi-select';
import { AsyncSelect } from '@/components/async-select';
import {
  useLazyListBusinessUnitsQuery
} from '@/lib/services/business-units';
import { useLazyListCompaniesQuery } from '@/lib/services/companies';
import { useLazyListRolesQuery } from '@/lib/services/roles';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { newUserSchema } from '../../schema/users';

export default function GeneralForm() {
  const { setValue, control, getValues } =
    useFormContext<z.infer<typeof newUserSchema>>();

  const [getCompanies] = useLazyListCompaniesQuery();
  const [getRoles] = useLazyListRolesQuery();
  const [getBusinessUnits] = useLazyListBusinessUnitsQuery();

  const [roles, setRoles] = useState<{ label: string; value: string }[]>([]);
  const [businessUnits, setBusinessUnits] = useState<{ label: string; value: string }[]>([]);

  // Watch for company_id changes to refetch roles
  const companyId = useWatch({
    control,
    name: 'company_id',
  }); // Reset dependent fields when company changes and fetch related data
  useEffect(() => {
    // Reset the state when company changes or is removed
    setRoles([]);
    setBusinessUnits([]);

    if (companyId) {
      // Reset the dependent fields if company changes
      setValue('role_id', '');
      setValue('business_units', []);

      // Fetch roles and business units for the selected company
      const fetchRelatedData = async () => {
        try {
          // Fetch roles for the selected company
          const rolesResponse = await getRoles({
            company_id: companyId,
          }).unwrap();
          const mappedRoles = rolesResponse.data.map((role) => ({
            label: role.name,
            value: role.id,
          }));
          setRoles(mappedRoles);

          // Fetch business units for the selected company
          const businessUnitsResponse = await getBusinessUnits().unwrap();
          const mappedBusinessUnits = businessUnitsResponse.data.map(
            (unit) => ({
              label: unit.name,
              value: unit.id,
            })
          );
          setBusinessUnits(mappedBusinessUnits);
        } catch (error) {
          console.error('Error fetching related data:', error);
        }
      };

      fetchRelatedData();
    }
  }, [companyId, setValue, getRoles, getBusinessUnits]);

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
    // If no company is selected, return empty array
    if (!companyId) {
      return [];
    }

    // Always fetch fresh data from the API to ensure it's up-to-date
    try {
      const rolesResponse = await getRoles({ company_id: companyId }).unwrap();

      if (!rolesResponse || !rolesResponse.data) {
        console.log('No roles found or invalid response');
        return [];
      }

      const mappedRoles = rolesResponse.data.map((role) => ({
        label: role.name,
        value: role.id,
      }));

      // Update the state for other components that might need this data
      setRoles(mappedRoles);
      return mappedRoles;
    } catch (error) {
      console.error('Error al obtener el rol:', error);
      return [];
    }
  };
  const handleGetBusinessUnits = async (query?: string) => {
    // If no company is selected, return empty array
    if (!companyId) {
      return [];
    }

    // Always fetch fresh data from the API to ensure it's up-to-date
    try {
      const businessUnitsResponse = await getBusinessUnits().unwrap();

      if (!businessUnitsResponse || !businessUnitsResponse.data) {
        console.log('No business units found or invalid response');
        return [];
      }

      const mappedBusinessUnits = businessUnitsResponse.data.map((unit) => ({
        label: unit.name,
        value: unit.id,
      }));

      // Update the state for other components that might need this data
      setBusinessUnits(mappedBusinessUnits);
      return mappedBusinessUnits;
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
      />{' '}
      {true && (
        <FormField
          control={control}
          name="role_id"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full p-4">
              <FormLabel className="w-fit">Rol</FormLabel>{' '}
              <FormControl>
                <AsyncSelect<{ label: string; value: string }, string>
                  key={`roles-${companyId || 'empty'}`}
                  label="Rol"
                  triggerClassName="!w-full"
                  placeholder={
                    !companyId
                      ? 'Seleccione una sede primero'
                      : 'Seleccionar rol'
                  }
                  fetcher={handleGetRoles}
                  getDisplayValue={(item) => item.label}
                  getOptionValue={(item) => item.value}
                  renderOption={(item) => <div>{item.label}</div>}
                  onChange={field.onChange}
                  value={field.value}
                  noResultsMessage="No se encontraron roles"
                  disabled={!companyId}
                />
              </FormControl>
              <FormDescription>
                Esta será el rol asociado al usuario.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}{' '}
      {true && (
        <FormField
          control={control}
          name={'business_units'}
          render={({ field }) => (
            <FormItem className="flex flex-col w-full p-4">
              <FormLabel className="w-fit">Unidades de negocio</FormLabel>{' '}
              <FormControl>
                <AsyncMultiSelect<{ value: string; label: string }, string>
                  key={`business-units-${companyId || 'empty'}`}
                  className={cn(
                    '!w-full bg-transparent pl-4',
                    control._formState.errors.business_units &&
                    'outline outline-1 outline-offset-[-1px] outline-destructive'
                  )}
                  searchPlaceholder="Buscar unidades de negocio..."
                  placeholder={
                    !companyId
                      ? 'Seleccione una sede primero'
                      : 'Seleccionar unidades de negocio'
                  }
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
                  disabled={!companyId}
                />
              </FormControl>
              <FormDescription>
                Estas serán las unidades de negocio asociadas al usuario.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}

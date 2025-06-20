'use client';

import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { newBusinessUnitSchema } from '../schema/business-units';
import { FormControl, FormField, FormLabel, FormItem, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AsyncSelect } from '@/components/async-select';
import { useCompanySelect } from '@/hooks/use-company-select';

export default function NewBusinessUnitForm({ isEditing = false }: { isEditing?: boolean }) {
  const { control, formState } = useFormContext<z.infer<typeof newBusinessUnitSchema>>();

  const { fetcher: handleSearchCompany } = useCompanySelect()

  return (
    <form className="grid grid-cols-1 gap-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input placeholder="Nombre de la unidad de negocio" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full"  >
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Input placeholder="Descripción de la unidad de negocio" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {
        !isEditing && (
          <FormField
            control={control}
            name="company_id"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Compañía</FormLabel>
                <FormControl>
                  <AsyncSelect<{ id: string; name: string }, string>
                    label="Compañía"
                    triggerClassName="!w-full"
                    placeholder="Seleccionar compañía"
                    fetcher={handleSearchCompany}
                    getDisplayValue={(item) => item.name}
                    getOptionValue={(item) => item.id}
                    renderOption={(item) => <div>{item.name}</div>}
                    onChange={field.onChange}
                    value={field.value}
                    noResultsMessage="No se encontraron compañías"
                    modal
                  />
                </FormControl>
                {formState.errors.company_id ?
                  <FormMessage />
                  :
                  <FormDescription>
                    Compañía a la que pertenece la unidad de negocio.
                  </FormDescription>
                }
              </FormItem>
            )}
          />
        )
      }
    </form>
  );
} 
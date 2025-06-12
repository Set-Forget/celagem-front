'use client';

import { AsyncSelect } from '@/components/async-select';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCompanySelect } from '@/hooks/use-company-select';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { newClassSchema } from '../schema/classes';

export default function NewClassForm({ isEditing = false }: { isEditing?: boolean }) {
  const { control, formState } = useFormContext<z.infer<typeof newClassSchema>>();

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
              <Input placeholder="Nombre de la clase" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {!isEditing && (
        <FormField
          control={control}
          name="company_id"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Compañía</FormLabel>
              <FormControl>
                <AsyncSelect<{ name: string; id: string }, string>
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
                  Compañía a la que pertenece la clase.
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
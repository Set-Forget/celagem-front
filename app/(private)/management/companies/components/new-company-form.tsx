'use client';

import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { newCompanySchema } from '../schema/companies';
import { FormControl, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function NewCompanyForm() {
  const { control } = useFormContext<z.infer<typeof newCompanySchema>>();

  return (
    <form className="grid grid-cols-1 gap-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input
                placeholder="Nombre de la empresa"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Input
                placeholder="Descripción de la empresa"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </form>
  )
}
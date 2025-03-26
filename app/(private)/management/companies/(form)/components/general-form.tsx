import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useFormContext } from 'react-hook-form';

import { z } from 'zod';
import { newCompanySchema } from '../../schema/companies';

export default function GeneralForm() {
  const { setValue, control } =
    useFormContext<z.infer<typeof newCompanySchema>>();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="name"
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
              Esta será el nombre asociado a la sede.
            </FormDescription>
            <FormMessage />   
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Descripción</FormLabel>
            <FormControl>
              <Input
                placeholder="Descripción"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la descripción asociada a la sede.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

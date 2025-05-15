import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

import { z } from 'zod';
import { newCurrencySchema } from '../../schema/currencies';

export default function GeneralForm() {
  const { setValue, control } =
    useFormContext<z.infer<typeof newCurrencySchema>>();

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
              Esta será el nombre asociado a la moneda.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="symbol"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Simbolo</FormLabel>
            <FormControl>
              <Input
                placeholder="Simbolo"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el simbolo asociado a la moneda.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="rate"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Tasa</FormLabel>
            <FormControl>
              <Input
                placeholder="Tasa"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la tasa asociada a la moneda.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}

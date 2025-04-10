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
import { newPaymentTermSchema } from '../../schema/payment-terms';

export default function GeneralForm() {
  const { setValue, control } =
    useFormContext<z.infer<typeof newPaymentTermSchema>>();

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
              Esta será el nombre asociado al término de pago.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="note"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Nota</FormLabel>
            <FormControl>
              <Input
                placeholder="Nota"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la nota asociada al término de pago.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}

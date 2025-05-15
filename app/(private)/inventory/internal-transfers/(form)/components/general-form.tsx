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
import { newInternalTransferSchema } from '../../schema/internal-transfers';

export default function GeneralForm() {
  const { setValue, control } =
    useFormContext<z.infer<typeof newInternalTransferSchema>>();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="source_location"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Origen</FormLabel>
            <FormControl>
              <Input
                placeholder="Origen"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el origen asociado a la transferencia.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="destination_location"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Destino</FormLabel>
            <FormControl>
              <Input
                placeholder="Destino"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el destino asociado a la transferencia.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="scheduled_date"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Fecha programada</FormLabel>
            <FormControl>
              <Input
                placeholder="Fecha programada"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la fecha programada asociada a la transferencia.
            </FormDescription>
          </FormItem>
        )}
      />
      
    </div>
  );
}

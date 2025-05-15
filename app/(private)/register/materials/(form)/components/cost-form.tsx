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
import { newMaterialSchema } from '../../schema/materials';

export default function CostForm() {
  const { setValue, control } =
    useFormContext<z.infer<typeof newMaterialSchema>>();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="cost_unit"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Unidad de costo</FormLabel>
            <FormControl>
              <Input
                placeholder="Unidad de costo"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la unidad de costo asociada al material.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="cost_unit_price"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Precio de costo</FormLabel>
            <FormControl>
              <Input
                placeholder="Precio de costo"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el precio de costo asociado al material.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}

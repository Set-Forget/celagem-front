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
import { newJobPositionSchema } from '../../schema/job-positions';

export default function GeneralForm() {
  const { setValue, control } =
    useFormContext<z.infer<typeof newJobPositionSchema>>();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="code"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Código</FormLabel>
            <FormControl>
              <Input
                placeholder="MED-GEN-BOG"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el codigo asociado al puesto de trabajo.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="unit"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Unidad</FormLabel>
            <FormControl>
              <Input
                placeholder="Unidad"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la unidad asociada al puesto de trabajo.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="unit_cost"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Costo unitario</FormLabel>
            <FormControl>
              <Input
                placeholder="Costo unitario"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el costo unitario asociado al puesto de trabajo.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="total_cost"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Costo total</FormLabel>
            <FormControl>
              <Input
                placeholder="Costo total"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el costo total asociado al puesto de trabajo.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}

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

export default function PurchaseForm() {
  const { setValue, control } =
    useFormContext<z.infer<typeof newMaterialSchema>>();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="purchase_unit"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Unidad de compra</FormLabel>
            <FormControl>
              <Input
                placeholder="Unidad de compra"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la unidad de compra asociada al material.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="purchase_unit_price"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Precio de compra</FormLabel>
            <FormControl>
              <Input
                placeholder="Precio de compra"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el precio de compra asociado al material.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="convertion_rate_purchase_to_cost_unit"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">
              Tasa de conversión de unidad compra a unidad costo
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Tasa de conversión de unidad compra a unidad costo"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la tasa de conversión de unidad compra a unidad costo
              asociada al material.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}

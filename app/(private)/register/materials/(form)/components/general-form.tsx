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

export default function GeneralForm() {
  const { setValue, control } =
    useFormContext<z.infer<typeof newMaterialSchema>>();

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
                placeholder="Código"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el codigo al que se asociará el material.
            </FormDescription>
          </FormItem>
        )}
      />

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
              Esta será el nombre asociado al material.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Ubicación</FormLabel>
            <FormControl>
              <Input
                placeholder="Ubicación"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la ubicación asociada al material.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="brand"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Marca</FormLabel>
            <FormControl>
              <Input
                placeholder="Marca"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la marca asociada al material.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="average_price"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Precio promedio</FormLabel>
            <FormControl>
              <Input
                placeholder="Precio promedio"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el precio promedio asociado al material.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="fraction"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Fracción</FormLabel>
            <FormControl>
              <Input
                placeholder="Fracción"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la fracción asociada al material.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}

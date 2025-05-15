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
import { newLocationSchema } from '../../schema/locations';

export default function GeneralForm() {
  const { setValue, control } =
    useFormContext<z.infer<typeof newLocationSchema>>();

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
              Esta será el nombre asociado a la ubicación.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="usage"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Uso</FormLabel>
            <FormControl>
              <Input
                placeholder="Uso"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el uso asociado a la ubicación.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="parent"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Ubicación Padre</FormLabel>
            <FormControl>
              <Input
                placeholder="Ubicación Padre"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la ubicación padre asociada a la ubicación.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="company"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Sede</FormLabel>
            <FormControl>
              <Input
                placeholder="Sede"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la sede asociada a la ubicación.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="warehouse"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Almacén</FormLabel>
            <FormControl>
              <Input
                placeholder="Almacén"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Este será el almacén asociado a la ubicación.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="posx"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Posición X</FormLabel>
            <FormControl>
              <Input
                placeholder="Posición X"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la posición X asociada a la ubicación.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="posy"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Posición Y</FormLabel>
            <FormControl>
              <Input
                placeholder="Posición Y"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la posición Y asociada a la ubicación.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="posz"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Posición Z</FormLabel>
            <FormControl>
              <Input
                placeholder="Posición Z"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la posición Z asociada a la ubicación.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="comment"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Comentario</FormLabel>
            <FormControl>
              <Input
                placeholder="Comentario"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Este será el comentario asociado a la ubicación.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="created_by"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Creado por</FormLabel>
            <FormControl>
              <Input
                placeholder="Creado por"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Este será el usuario que creó la ubicación.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}

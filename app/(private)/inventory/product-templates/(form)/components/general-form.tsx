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
import { newProductTemplateSchema } from '../../schema/products-templates';

export default function GeneralForm() {
  const { setValue, control } =
    useFormContext<z.infer<typeof newProductTemplateSchema>>();

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
              Esta será el nombre asociado al material.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Tipo</FormLabel>
            <FormControl>
              <Input
                placeholder="Tipo"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el tipo asociado al material.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Categoría</FormLabel>
            <FormControl>
              <Input
                placeholder="Categoría"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la categoría asociada al material.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="unit_of_measure"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Unidad de medida</FormLabel>
            <FormControl>
              <Input
                placeholder="Unidad de medida"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la unidad de medida asociada al material.
            </FormDescription>
          </FormItem>
        )}
      />
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
        name="tracking"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Seguimiento</FormLabel>
            <FormControl>
              <Input
                placeholder="Seguimiento"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el seguimiento asociado al material.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="purchase_line_warn"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Advertencia línea compra</FormLabel>
            <FormControl>
              <Input
                placeholder="Advertencia línea compra"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la advertencia de línea de compra asociada al material.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="sale_line_warn"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Advertencia línea venta</FormLabel>
            <FormControl>
              <Input
                placeholder="Advertencia línea venta"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la advertencia de línea de venta asociada al material.
            </FormDescription>
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
              Esta será la descripción asociada al material.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="sale_price"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Precio de venta</FormLabel>
            <FormControl>
              <Input
                placeholder="Precio de venta"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el precio de venta asociado al material.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="cost_price"
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
      <FormField
        control={control}
        name="currency"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Moneda</FormLabel>
            <FormControl>
              <Input
                placeholder="Moneda"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la moneda asociada al material.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}

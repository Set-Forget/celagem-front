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
import { DeliverySteps, ManufactureSteps, newWarehouseSchema, ReceptionSteps } from '../../schema/warehouses';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

export default function GeneralForm() {
  const { setValue, control } =
    useFormContext<z.infer<typeof newWarehouseSchema>>();

  const reception_steps: { label: string; value: ReceptionSteps }[] = [
    { label: 'Un paso', value: 'one_step' },
    { label: 'Dos pasos', value: 'two_steps' },
    { label: 'Tres pasos', value: 'three_steps' },
  ];

  const delivery_steps: { label: string; value: DeliverySteps }[] = [
    { label: 'Solo envio', value: 'ship_only' },
    { label: 'Recoger y enviar', value: 'pick_ship' },
    { label: 'Recoger, empaquetar y enviar', value: 'pick_pack_ship' },
  ];

  const manufacture_steps: { label: string; value: ManufactureSteps }[] = [
    { label: 'Un paso', value: 'mrp_one_step' },
    { label: 'Dos pasos', value: 'pbm' },
    { label: 'Tres pasos', value: 'pbm_sam' },
  ];

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
        name="view_location"
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
        name="reception_steps"
        render={({ field }) => (
          <div className="flex flex-row gap-4 items-center justify-center p-4">
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Pasos de recepcion</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-full justify-between pl-3 font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? reception_steps.find(
                            (reception_step) =>
                              field.value?.toString() ===
                              reception_step.value.toString()
                          )?.label
                        : 'Seleccionar pasos de recepcion'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Command>
                    <CommandInput
                      placeholder="Buscar pasos de recepcion..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>
                        No se encontraron pasos de recepcion.
                      </CommandEmpty>
                      <CommandGroup>
                        {reception_steps.map((reception_step) => (
                          <CommandItem
                            value={reception_step.label}
                            key={reception_step.value}
                            onSelect={() => {
                              setValue('reception_steps', reception_step.value);
                            }}
                          >
                            {reception_step.label}
                            <Check
                              className={cn(
                                'ml-auto',
                                field.value?.toString() === reception_step.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}{' '}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Esta será el paso de recepcion asociado a la entrada.
              </FormDescription>
            </FormItem>
          </div>
        )}
      />
      <FormField
        control={control}
        name="delivery_steps"
        render={({ field }) => (
          <div className="flex flex-row gap-4 items-center justify-center p-4">
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Pasos de expedicion</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-full justify-between pl-3 font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? delivery_steps.find(
                            (delivery_step) =>
                              field.value?.toString() ===
                              delivery_step.value.toString()
                          )?.label
                        : 'Seleccionar pasos de expedicion'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Command>
                    <CommandInput
                      placeholder="Buscar pasos de expedicion..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>
                        No se encontraron pasos de expedicion.
                      </CommandEmpty>
                      <CommandGroup>
                        {delivery_steps.map((delivery_step) => (
                          <CommandItem
                            value={delivery_step.label}
                            key={delivery_step.value}
                            onSelect={() => {
                              setValue('delivery_steps', delivery_step.value);
                            }}
                          >
                            {delivery_step.label}
                            <Check
                              className={cn(
                                'ml-auto',
                                field.value?.toString() === delivery_step.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}{' '}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Esta será el paso de expedicion asociado a la entrada.
              </FormDescription>
            </FormItem>
          </div>
        )}
      />
      <FormField
        control={control}
        name="manufacture_steps"
        render={({ field }) => (
          <div className="flex flex-row gap-4 items-center justify-center p-4">
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Pasos de manufactura</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-full justify-between pl-3 font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? manufacture_steps.find(
                            (manufacture_step) =>
                              field.value?.toString() ===
                              manufacture_step.value.toString()
                          )?.label
                        : 'Seleccionar pasos de manufactura'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Command>
                    <CommandInput
                      placeholder="Buscar pasos de manufactura..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>
                        No se encontraron pasos de manufactura.
                      </CommandEmpty>
                      <CommandGroup>
                        {manufacture_steps.map((manufacture_step) => (
                          <CommandItem
                            value={manufacture_step.label}
                            key={manufacture_step.value}
                            onSelect={() => {
                              setValue(
                                'manufacture_steps',
                                manufacture_step.value
                              );
                            }}
                          >
                            {manufacture_step.label}
                            <Check
                              className={cn(
                                'ml-auto',
                                field.value?.toString() ===
                                  manufacture_step.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}{' '}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Esta será el paso de manufactura asociado a la entrada.
              </FormDescription>
            </FormItem>
          </div>
        )}
      />
      {/* <FormField
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
      /> */}
    </div>
  );
}

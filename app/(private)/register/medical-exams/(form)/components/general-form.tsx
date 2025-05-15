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
import { newMedicalExamSchema } from '../../schema/medical-exams';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

export default function GeneralForm() {
  const { setValue, control } =
    useFormContext<z.infer<typeof newMedicalExamSchema>>();

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
              Esta será el codigo asociado al examen medico.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <div className="flex flex-col gap-4 items-start justify-center p-4">
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Estado</FormLabel>
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
                        ? (['EXTERNO', 'INTERNO'] as const).find(
                            (status) => field.value === status
                          )
                        : 'Selecciona un estado'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Command>
                    <CommandInput
                      placeholder="Buscar estado..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No se encontraron estados.</CommandEmpty>
                      <CommandGroup>
                        {(['EXTERNO', 'INTERNO'] as const).map((status) => (
                          <CommandItem
                            value={status}
                            key={status}
                            onSelect={() => {
                              setValue('status', status);
                            }}
                          >
                            {status}
                            <Check
                              className={cn(
                                'ml-auto',
                                field.value === status
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Esta será el estado asociado al procedimiento.
              </FormDescription>
            </FormItem>
          </div>
        )}
      />
      <FormField
        control={control}
        name="cups_code"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Código CUPS</FormLabel>
            <FormControl>
              <Input
                placeholder="Código CUPS"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el código CUPS asociado al examen medico.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Descripcion</FormLabel>
            <FormControl>
              <Input
                placeholder="Descripcion del procedimiento"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la descripcion asociada al procedimiento.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="cost"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Costo</FormLabel>
            <FormControl>
              <Input
                placeholder="Costo"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el costo asociado al examen medico.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="unit_cost"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Costo Unitario</FormLabel>
            <FormControl>
              <Input
                placeholder="Costo unitario"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el costo unitario asociado al examen medico.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}

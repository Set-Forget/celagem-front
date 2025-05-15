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
import { newProcedureSchema } from '../../schema/procedures';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export default function GeneralForm() {
  const { setValue, control } =
    useFormContext<z.infer<typeof newProcedureSchema>>();

  const procedureSchemas = [
    'APORTANTE DE SEMEN',
    'GESTANTE',
    'OVO-APORTANTE',
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="cups_code"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full p-4">
            <FormLabel className="w-fit">Código CUPS</FormLabel>
            <FormControl>
              <Input
                placeholder="890223"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será el código CUPS al que se asociará el acto clinico.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="schema"
        render={({ field }) => (
          <div className="flex flex-col gap-4 items-start justify-center">
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Esquema</FormLabel>
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
                        ? procedureSchemas.find(
                            (schema) => field.value === schema
                          )
                        : 'Selecciona un esquema'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Command>
                    <CommandInput
                      placeholder="Buscar esquema..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No se encontraron esquemas.</CommandEmpty>
                      <CommandGroup>
                        {procedureSchemas.map((schema) => (
                          <CommandItem
                            value={schema}
                            key={schema}
                            onSelect={() => {
                              setValue('schema', schema);
                            }}
                          >
                            {schema}
                            <Check
                              className={cn(
                                'ml-auto',
                                field.value === schema
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
                Esta será la descripcion asociada al acto clinico.
              </FormDescription>
            </FormItem>
          </div>
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
                placeholder="Descripcion del acto clinico"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esta será la descripcion asociada al acto clinico.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}

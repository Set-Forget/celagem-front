'use client';

import {
  // CalendarIcon,
  Check,
  // CheckIcon,
  ChevronsUpDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

// import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  // FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
// import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Header from '@/components/header';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  // Box,
  House,
} from 'lucide-react';
// import { MultiSelect } from '@/components/multi-select';
import { Input } from '@/components/ui/input';
import { medicalExamSchema } from '../schema/medical-exam';

export default function NewMedicalExamPage() {
  const newMedicalExamForm = useForm<z.infer<typeof medicalExamSchema>>({
    resolver: zodResolver(medicalExamSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = (data: z.infer<typeof medicalExamSchema>) => {
    console.log(data);
  };

  return (
    <Form {...newMedicalExamForm}>
      <Header title="Nuevo examen medico">
        <div className="flex justify-end gap-2 ml-auto">
          {/* <Button
            type="button"
            variant="ghost"
            size="sm"
          >
            Previsualizar
          </Button> */}
          <Button
            type="submit"
            onClick={newMedicalExamForm.handleSubmit(onSubmit)}
            size="sm"
          >
            Crear examen medico
          </Button>
        </div>
      </Header>
      <Tabs
        className="mt-4"
        defaultValue="tab-1"
      >
        <ScrollArea>
          <TabsList className="relative justify-start !pl-4 h-auto w-full gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
            <TabsTrigger
              value="tab-1"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <House
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              General
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent
          value="tab-1"
          className="m-0 p-1"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <FormField
              control={newMedicalExamForm.control}
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
              control={newMedicalExamForm.control}
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
                            <CommandEmpty>
                              No se encontraron estados.
                            </CommandEmpty>
                            <CommandGroup>
                              {(['EXTERNO', 'INTERNO'] as const).map(
                                (status) => (
                                  <CommandItem
                                    value={status}
                                    key={status}
                                    onSelect={() => {
                                      newMedicalExamForm.setValue(
                                        'status',
                                        status
                                      );
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
                                )
                              )}
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
              control={newMedicalExamForm.control}
              name="cup_code"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full p-4">
                  <FormLabel className="w-fit">Código CUP</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Código CUP"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será el codigo CUP asociado al examen medico.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={newMedicalExamForm.control}
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
              control={newMedicalExamForm.control}
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
              control={newMedicalExamForm.control}
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
        </TabsContent>
      </Tabs>
    </Form>
  );
}

'use client';

import { Button } from '@/components/ui/button';

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
import { zodResolver } from '@hookform/resolvers/zod';
// import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Header from '@/components/header';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Check,
  ChevronsUpDown,
  // Box,
  House,
} from 'lucide-react';
// import { MultiSelect } from '@/components/multi-select';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { materialsMock } from '@/app/(private)/register/materials/mocks/materials';
import { materialsInventoryEntrySchema } from '../schema/materials-inventory-entry';

export default function NewMaterialInventoryEntryPage() {
  const newMaterialInventoryEntryForm = useForm<
    z.infer<typeof materialsInventoryEntrySchema>
  >({
    resolver: zodResolver(materialsInventoryEntrySchema),
  });

  const onSubmit = (data: z.infer<typeof materialsInventoryEntrySchema>) => {
    console.log(data);
  };

  const materials = materialsMock.map((material) => ({
    label: material.code + ' - ' + (material.brand ?? 'Generico') + ' - ' + material.name,
    value: material.id,
  }));

  return (
    <Form {...newMaterialInventoryEntryForm}>
      <Header title="Nueva entrada">
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
            onClick={newMaterialInventoryEntryForm.handleSubmit(onSubmit)}
            size="sm"
          >
            Crear entrada
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
              control={newMaterialInventoryEntryForm.control}
              name="id"
              render={({ field }) => (
                <div className="flex flex-row gap-4 items-center justify-center p-4">
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Material</FormLabel>
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
                              ? materials.find(
                                (material) => field.value?.toString() === material.value.toString()                              )?.label
                              : 'Selecciona un material'}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Command>
                          <CommandInput
                            placeholder="Buscar materiales..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron materiales.
                            </CommandEmpty>
                            <CommandGroup>
                              {materials.map((material) => (
                                <CommandItem
                                  value={material.label}
                                  key={material.value}
                                  onSelect={() => {
                                    newMaterialInventoryEntryForm.setValue(
                                      'id',
                                      parseInt(material.value)
                                    );
                                  }}                                >
                                  {material.label}
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      field.value?.toString() === material.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Esta será el material asociado a la entrada.
                    </FormDescription>
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={newMaterialInventoryEntryForm.control}
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
                    Esta será la ubicación asociada a la entrada.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={newMaterialInventoryEntryForm.control}
              name="lot_number"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full p-4">
                  <FormLabel className="w-fit">Número de lote</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Número de lote"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será el número de lote asociado a la entrada.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={newMaterialInventoryEntryForm.control}
              name="qty"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full p-4">
                  <FormLabel className="w-fit">Cantidad</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Cantidad"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será la cantidad asociada a la entrada.
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

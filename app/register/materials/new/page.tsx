'use client';

import { DollarSign, PiggyBank } from 'lucide-react';

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
  // Box,
  House,
} from 'lucide-react';
// import { MultiSelect } from '@/components/multi-select';
import { Input } from '@/components/ui/input';
import { materialsSchema } from '../schema/materials';

export default function NewMaterialPage() {
  const newMaterialForm = useForm<z.infer<typeof materialsSchema>>({
    resolver: zodResolver(materialsSchema),
  });

  const onSubmit = (data: z.infer<typeof materialsSchema>) => {
    console.log(data);
  };

  return (
    <Form {...newMaterialForm}>
      <Header title="Nuevo material">
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
            onClick={newMaterialForm.handleSubmit(onSubmit)}
            size="sm"
          >
            Crear material
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
            <TabsTrigger
              value="tab-2"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <PiggyBank
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Compra
            </TabsTrigger>
            <TabsTrigger
              value="tab-3"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <DollarSign
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Costo
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
              control={newMaterialForm.control}
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
              control={newMaterialForm.control}
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
              control={newMaterialForm.control}
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
              control={newMaterialForm.control}
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
              control={newMaterialForm.control}
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
              control={newMaterialForm.control}
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
        </TabsContent>
        <TabsContent
          value="tab-2"
          className="m-0 p-1"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <FormField
              control={newMaterialForm.control}
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
              control={newMaterialForm.control}
              name="purchase_tax"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full p-4">
                  <FormLabel className="w-fit">Impuesto de compra</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Impuesto de compra"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será el impuesto de compra asociado al material.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={newMaterialForm.control}
              name="purchase_price"
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
          </div>
        </TabsContent>
        <TabsContent
          value="tab-3"
          className="m-0 p-1"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <FormField
              control={newMaterialForm.control}
              name="cost_unit"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full p-4">
                  <FormLabel className="w-fit">Unidad de costo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Unidad de costo"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será la unidad de costo asociada al material.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={newMaterialForm.control}
              name="cost_tax"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full p-4">
                  <FormLabel className="w-fit">Impuesto de costo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Impuesto de costo"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será el impuesto de costo asociado al material.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={newMaterialForm.control}
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
          </div>
        </TabsContent>
      </Tabs>
    </Form>
  );
}

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

import { ClassCreateBody, Classes, classesSchema } from '../schema/classes';
import { useCreateClassMutation } from '@/lib/services/classes';
import router from 'next/router';

export default function NewClassesPage({ classUnit }: { classUnit: Classes }) {
  const newClassForm = useForm<ClassCreateBody>({
    resolver: zodResolver(classesSchema),
  });

  if (classUnit) {
    newClassForm.setValue('name', classUnit?.name || '');
  }

  const [createClass, { isLoading }] = useCreateClassMutation();

  const onSubmit = async (data: ClassCreateBody) => {
    try {
      const response = await createClass({
        ...data,
      }).unwrap();

      if (response.status === 'success') {
        router.push(`/management/classes/${response.data.id}`);
        // toast.custom((t) => (
        //   <CustomSonner
        //     t={t}
        //     description="Factura de compra creada exitosamente"
        //   />
        // ));
      }
    } catch (error) {
      console.error(error);
      // toast.custom((t) => (
      //   <CustomSonner
      //     t={t}
      //     description="Ocurrió un error al crear la factura de compra"
      //     variant="error"
      //   />
      // ));
    }
  };

  return (
    <Form {...newClassForm}>
      <Header title={classUnit ? 'Editando' : 'Nueva clase'}>
        <div className="flex justify-end gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newClassForm.handleSubmit(onSubmit)}
            size="sm"
          >
            {classUnit ? 'Guardar cambios' : 'Crear material'}
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
              control={newClassForm.control}
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
                    Esta será el nombre asociado a la clase.
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
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
  // Box,
  House,
} from 'lucide-react';

import { Input } from '@/components/ui/input';

import { jobPositionSchema } from '../schema/job-position';

export default function NewJobPositionPage() {
  const newJobPositionForm = useForm<z.infer<typeof jobPositionSchema>>({
    resolver: zodResolver(jobPositionSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = (data: z.infer<typeof jobPositionSchema>) => {
    console.log(data);
  };

  return (
    <Form {...newJobPositionForm}>
      <Header title="Nuevo puesto de trabajo">
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
            onClick={newJobPositionForm.handleSubmit(onSubmit)}
            size="sm"
          >
            Crear puesto de trabajo
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
              control={newJobPositionForm.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full p-4">
                  <FormLabel className="w-fit">Código</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="MED-GEN-BOG"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será el codigo asociado al puesto de trabajo.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={newJobPositionForm.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full p-4">
                  <FormLabel className="w-fit">Unidad</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Unidad"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será la unidad asociada al puesto de trabajo.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={newJobPositionForm.control}
              name="unit_cost"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full p-4">
                  <FormLabel className="w-fit">Costo unitario</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Costo unitario"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será el costo unitario asociado al puesto de trabajo.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={newJobPositionForm.control}
              name="total_cost"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full p-4">
                  <FormLabel className="w-fit">Costo total</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Costo total"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será el costo total asociado al puesto de trabajo.
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

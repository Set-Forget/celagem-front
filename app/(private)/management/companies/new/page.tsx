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
import { Companies, companiesSchema } from '../schema/companies';

export default function NewCompanyPage({ company }: { company: Companies }) {
  const newCompanyForm = useForm<z.infer<typeof companiesSchema>>({
    resolver: zodResolver(companiesSchema),
  });

  if (company) {
    newCompanyForm.setValue('name', company?.name || '');
    newCompanyForm.setValue('description', company?.description || '');
  }

  const onSubmit = (data: z.infer<typeof companiesSchema>) => {
    console.log(data);
  };

  return (
    <Form {...newCompanyForm}>
      <Header title={company ? 'Editando' : 'Nueva compañia'}>
        <div className="flex justify-end gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newCompanyForm.handleSubmit(onSubmit)}
            size="sm"
          >
            {company ? 'Guardar cambios' : 'Crear compañia'}
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
              control={newCompanyForm.control}
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
                    Esta será el nombre asociado a la compañia.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={newCompanyForm.control}
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
                    Esta será la descripción asociada a la compañia.
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

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
import { Roles, rolesSchema } from '../schema/roles';

export default function NewRolePage({ role }: { role: Roles }) {
  const newRoleForm = useForm<z.infer<typeof rolesSchema>>({
    resolver: zodResolver(rolesSchema),
  });

  if (role) {
    newRoleForm.setValue('name', role?.name || '');
  }

  const onSubmit = (data: z.infer<typeof rolesSchema>) => {
    console.log(data);
  };

  return (
    <Form {...newRoleForm}>
      <Header title={role ? 'Editando' : 'Nuevo Rol'}>
        <div className="flex justify-end gap-2 ml-auto">
          
          <Button
            type="submit"
            onClick={newRoleForm.handleSubmit(onSubmit)}
            size="sm"
          >
            {role ? 'Guardar cambios' : 'Crear rol'}
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
              control={newRoleForm.control}
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
                    Esta será el nombre del rol.
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

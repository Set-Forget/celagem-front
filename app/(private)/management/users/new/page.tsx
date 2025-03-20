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
import { Users, usersSchema } from '../schema/users';

export default function NewUserPage({ user }: { user: Users }) {
  const newUserForm = useForm<z.infer<typeof usersSchema>>({
    resolver: zodResolver(usersSchema),
  });

  if (user) {
    newUserForm.setValue('first_name', user?.first_name || '');
    newUserForm.setValue('last_name', user?.last_name || '');
    newUserForm.setValue('email', user?.email || '');
    newUserForm.setValue(
      'is_email_confirmed',
      user?.is_email_confirmed || false
    );
  }

  const onSubmit = (data: z.infer<typeof usersSchema>) => {
    if (user) {
      console.log(data);
    } else {
      console.log(data);
    }
  };

  return (
    <Form {...newUserForm}>
      <Header title={user ? 'Editando' : 'Nuevo Usuario'}>
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
            onClick={newUserForm.handleSubmit(onSubmit)}
            size="sm"
          >
            {user ? 'Guardar cambios' : 'Crear usuario'}
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
              control={newUserForm.control}
              name="first_name"
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
                    Esta será el nombre asociado al usuario.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={newUserForm.control}
              name="last_name"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full p-4">
                  <FormLabel className="w-fit">Apellido</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Apellido"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será el apellido asociado al usuario.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={newUserForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full p-4">
                  <FormLabel className="w-fit">Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Correo electrónico"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será el correo electrónico asociado al usuario.
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

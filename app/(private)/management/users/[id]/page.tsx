'use client';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRetrieveUserQuery } from '@/lib/services/users';
import { House } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserPage() {
  const pathname = usePathname();
  const router = useRouter();

  const { id } = useParams();

  const userId = id as string;

  const { data, isLoading } = useRetrieveUserQuery({ id: userId });

  const user = data?.data;

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <div>Usuario no encontrado</div>;
  }

  return (
    <>
      <Header title={user?.first_name + ' ' + user?.last_name}>
        <div className="ml-auto flex gap-2">
          <Button
            type="submit"
            size="sm"
            onClick={() => router.push(`${pathname}/edit`)}
          >
            Editar usuario
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
            {user?.first_name && (
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Nombre</label>
                <span className="text-sm">{user?.first_name}</span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Apellido</label>
              <span className="text-sm">{user?.last_name}</span>
            </div>
            {user?.email && (
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">
                  Correo electrónico
                </label>
                <span className="text-sm">{user?.email}</span>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}


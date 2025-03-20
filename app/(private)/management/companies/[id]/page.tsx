'use client';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRetrieveCompanyQuery } from '@/lib/services/companies';
import { House } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';

export default function CompanyPage() {
  const pathname = usePathname();
  const router = useRouter();

  const { id } = useParams();

  const companyId = id as string;

  const { data, isLoading } = useRetrieveCompanyQuery({ id: companyId });

  const company = data?.data;

  return (
    <>
      <Header title={company?.name}>
        <div className="ml-auto flex gap-2">
          <Button
            type="submit"
            size="sm"
            onClick={() => router.push(`${pathname}/edit`)}
          >
            Editar compañia
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
            {company?.description && (
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">
                  Descripción
                </label>
                <span className="text-sm">{company?.description}</span>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { setDialogsState } from '@/lib/store/dialogs-store';
import { Plus } from 'lucide-react';
import { columns } from './components/columns';
// import NewAccountTypeDialog from './components/new-account-type-dialog';
import { AccountType } from './schemas/account-types';
import { usePathname, useRouter } from 'next/navigation';
import Toolbar from './components/toolbar';
import { AccountTypes } from './data/account-types';



export default function AccountTypesMasterPage() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <Header title="Maestro de tipos de cuenta">
        {/* <Button
          size="sm"
          className="ml-auto"
          onClick={() => {
            setDialogsState({
              open: 'new-account-type',
            });
          }}
        >
          <Plus className="w-4 h-4" />
          Crear tipo de cuenta
        </Button> */}
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={AccountTypes}
          columns={columns}
          // onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          // toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
      {/* <NewAccountTypeDialog /> */}
    </>
  );
}

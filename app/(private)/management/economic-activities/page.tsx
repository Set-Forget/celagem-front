'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useListEconomicActivitiesQuery } from '@/lib/services/economic_activities';
import { setDialogsState } from '@/lib/store/dialogs-store';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { columns } from './components/columns';
import EditUserDialog from './components/edit-economic-activity-dialog';
import NewUserDialog from './components/new-economic-activity-dialog';
import Toolbar from './components/toolbar';
import UserDetailsDialog from './components/view-economic-activity-dialog';
import NewEconomicActivityDialog from './components/new-economic-activity-dialog';
import ViewEconomicActivityDialog from './components/view-economic-activity-dialog';
import EditEconomicActivityDialog from './components/edit-economic-activity-dialog';

export default function Page() {
  const searchParams = useSearchParams()

  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }

  const { data: economicActivities, isLoading: isEconomicActivitiesLoading } = useListEconomicActivitiesQuery();

  const searchName = search.field === "name" ? search?.query : undefined
  const searchCode = search.field === "code" ? search?.query : undefined

  return (
    <div>
      <Header title="Actividades económicas">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => setDialogsState({ open: 'new-economic-activity' })}
          disabled={isEconomicActivitiesLoading}
        >
          <Plus className="w-4 h-4" />
          Crear actividad económica
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={economicActivities?.data
            ?.filter((economicActivity) => {
              if (searchName) {
                const fullName = `${economicActivity.name}`
                return fullName.toLowerCase().includes(searchName?.toLowerCase() || '')
              }
              if (searchCode) {
                return economicActivity.code.toLowerCase().includes(searchCode?.toLowerCase() || '')
              }
              return true
            })
            || []}
          columns={columns}
          loading={isEconomicActivitiesLoading}
          onRowClick={(row) => setDialogsState({ open: 'view-economic-activity', payload: { economic_activity_id: row.id } })}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
      <ViewEconomicActivityDialog />
      <NewEconomicActivityDialog />
      <EditEconomicActivityDialog />
    </div>
  );
}
